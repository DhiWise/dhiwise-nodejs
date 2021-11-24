/* global MESSAGE,_ */
const fs = require('fs');
const os = require('os');
const mongoose = require('mongoose');

const homedir = os.homedir();
const {
  COMPLETED, FAILED, QUEUE_BUILD_REJECTED,
} = require('../../models/constants/application').IN_PROCESS_STATUS;
const {
  TXT_FILE_EXTENSION, IMAGE_FILE_EXTENSION, TXT_SECOND_LAST_FILE_EXTENSION, EXTENSION_TYPE,
} = require('../../constants/common');
const viewUsecase = require('./view');

const { getApplicationDetail } = require('../util/getApplicationData');
const {
  BAD_REQUEST, OK, SERVER_ERROR,
} = require('../../constants/message').message;

function getFiles (dir, allFiles = [], parent = '') {
  const outPut = allFiles || [];
  const files = fs.readdirSync(dir);
  /*
   * Object.keys(files).forEach(function(key) {
   *   yield put(setCurrentValue(key, currentValues[key]));
   * })
   */
  files.forEach((file) => {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      if (file !== '.git') {
        outPut.push({
          name: file,
          path: `${parent}/${file}`,
          type: 2,
          child: getFiles(name, [], `${parent}/${file}`),
        });
      }
    } else {
      // check file extension and assign value type wise
      const lastIndex = file.lastIndexOf('.');
      const secondLastIndex = file.lastIndexOf('.', file.lastIndexOf('.') - 1);
      const fileExtension = file.substring(lastIndex + 1);
      const fileExtensionSecondLast = file.substring(secondLastIndex + 1, lastIndex);
      let extType = EXTENSION_TYPE.DEFAULT;
      if (TXT_FILE_EXTENSION.includes(fileExtension.toUpperCase())) {
        extType = EXTENSION_TYPE.TEXT;
      } else if (IMAGE_FILE_EXTENSION.includes(fileExtension.toUpperCase())) {
        extType = EXTENSION_TYPE.IMAGE;
      } else if (TXT_SECOND_LAST_FILE_EXTENSION.includes(fileExtensionSecondLast.toUpperCase())) {
        extType = EXTENSION_TYPE.TEXT;
      }

      outPut.push({
        name: file,
        path: `${parent}/${file}`,
        type: 1,
        extType,
      });
    }
  });
  /*
   * for (const i of files) {
   *   const name = `${dir}/${files[i]}`;
   *   if (fs.statSync(name).isDirectory()) {
   *     outPut.push({
   *       name: files[i],
   *  path: `${parent}/${files[i]}`,
   *  type: 2,
   * child: getFiles(name, [], `${parent}/${files[i]}`),
   *     });
   *   } else {
   *     outPut.push({ name: files[i], path: `${parent}/${files[i]}`, type: 1 });
   *   }
   * }
   */
  return outPut;
}
const useCase = (applicationRepo, schemaRepo, generatorRepo, projectRepo) => async (params) => {
  try {
    if (!params.applicationId) {
      return {
        ...BAD_REQUEST,
        data: {},
      };
    }
    if (params.applicationId) {
      const isValidId = mongoose.Types.ObjectId.isValid(params.applicationId);
      if (!isValidId) {
        return {
          ...BAD_REQUEST,
          data: {},
        };
      }
    }
    const applicationData = await getApplicationDetail(applicationRepo)({ applicationId: params.applicationId });
    if (applicationData?.code !== MESSAGE.OK.code) {
      return applicationData;
    }
    const project = applicationData?.data;
    let filter = { id: project?.generatedId };
    let generated = await generatorRepo.getById(filter);
    const mainGenerated = _.cloneDeep(generated);
    if (!generated) {
      filter = {
        find: {
          _id: project?.tempGeneratedId,
          'inProcessStatus.build_app': { $in: [COMPLETED, FAILED, QUEUE_BUILD_REJECTED] },
        },
      };
      generated = await generatorRepo.get(filter);
      if (!generated) {
        return {
          ...BAD_REQUEST,
          data: {},
        };
      }
    }
    // tempGeneratedIdData return
    let tempGenerated;
    if (project.tempGeneratedId) {
      const tempFilter = { id: project.tempGeneratedId };
      tempGenerated = await generatorRepo.getById(tempFilter);
      if (!tempGenerated) {
        return {
          ...BAD_REQUEST,
          data: {},
        };
      }
    }

    let path = `${homedir}${generated.config.generatorPath}/${generated._id}/${project.name}`;
    // For getting react final code project file
    if (params.isReact) {
      path = `${path}_REACT`;
    }
    /*
     * console.log('path=========================>', path);
     * console.log('generated=========================>', generated);
     */
    if (!fs.existsSync(path)) {
      return {
        ...BAD_REQUEST,
        data: null,
      };
    }
    const fileData = getFiles(path, [], '');
    let appData = await (viewUsecase(applicationRepo, projectRepo))({ id: params.applicationId });
    if (appData.data) {
      appData = appData.data;
      if (appData.application) {
        appData.application = appData.application.toObject();
        appData.application.generatedIdData = _.pick(mainGenerated, ['type', 'status', 'createdAt', 'updatedAt', '_id', 'versionNumber', 'semanticVersionNumber', 'tempGeneratedId']);
        appData.application.tempGeneratedIdData = _.pick(tempGenerated, ['type', 'status', 'createdAt', 'updatedAt', '_id', 'versionNumber', 'semanticVersionNumber', 'tempGeneratedId']);
      }
    } else {
      appData = {};
    }
    return {
      ...OK,
      data: {
        list: fileData,
        ...appData,
      },
    };
  } catch (err) {
    // console.log('error', err);
    return SERVER_ERROR;
  }
};

module.exports = useCase;
