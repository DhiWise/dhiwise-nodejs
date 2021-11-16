const uuid4 = require('uuid').v4;
const {
  clone, isEmpty,
} = require('lodash');

const renameKey = (object, key, newKey) => {
  const clonedObj = clone(object);
  const targetKey = clonedObj[key];
  delete clonedObj[key];
  clonedObj[newKey] = targetKey;
  return clonedObj;
};
const postman = require('postman-collection');
global._ = require('lodash');

module.exports = {
  async createCollectionV2_0 (info, platform = true) {
    const mainObj = {};
    const infoObj = {};

    const mainItem = [];
    // Project Details
    infoObj.name = info.project.name;
    infoObj._postman_id = uuid4();
    infoObj.description = info.project.description;
    infoObj.schema = 'https://schema.getpostman.com/json/collection/v2.0.0/collection.json';

    const body = {
      mode: '',
      raw: '',
    };
    const header = [
      {
        key: 'Content-Type',
        value: 'application/json',
        description: '',
      },
    ];
    body.mode = 'raw';
    body.raw = '{}';

    if (platform) {
      info.item.forEach((e) => {
        const modelItem = [];
        e.item.forEach((ej) => {
          const item = [];
          ej.request?.forEach((r) => {
            const request = {
              url: '',
              method: '',
              header: null,
              body: null,
              description: '',
              auth: '',
            };
            const itemData = {
              name: '',
              request: null,
              response: null,
              _postman_isSubFolder: true,
            };
            request.url = r.url;
            request.method = r.method;
            request.header = r.header ? r.header : header;
            request.body = r.body ? r.body : body;
            request.auth = r.auth || {};

            // set Item Data
            itemData.name = r.name;

            itemData.request = request;
            itemData.response = r.response;
            item.push(itemData);
          });

          const modelItemData = {
            name: null,
            description: null,
            item: null,
          };
          modelItemData.name = ej.name;
          modelItemData.description = ej.desc;
          modelItemData.item = item;
          modelItem.push(modelItemData);
        });

        const mainItemData = {
          name: null,
          description: null,
          item: null,
        };
        mainItemData.name = e.name;
        mainItemData.description = e.description;
        mainItemData.item = modelItem;

        // main Item Data push into main Item

        mainItem.push(mainItemData);
      });
    } else {
      info.item.forEach((e) => {
        const item = [];
        e.request.forEach((r) => {
          const responseObject = {};
          const request = {
            url: '',
            method: '',
            header: null,
            body: null,
            description: '',
          };
          const itemData = {
            name: '',
            request: null,
            response: null,
          };
          request.url = r.url;
          request.method = r.method;
          request.header = header;
          request.body = r.body ? r.body : body;

          // set Item Data
          itemData.name = r.name;

          itemData.request = request;
          responseObject.name = `${r.name}_response`;
          responseObject.originalRequest = {
            method: r.method,
            header: r.header ? r.header : header,
            url: { raw: r.url },
          };
          responseObject.status = 'OK';
          responseObject.code = 200;
          responseObject._postman_previewlanguage = 'json';
          if (Object.keys(r.body ?? body).length) {
            if (Object.keys(r.body ?? body).includes('raw')) {
              if (r.body !== undefined) {
                delete r.body.mode;
              }
              if (body.mode) {
                delete body.mode;
              }
            }
          }
          responseObject.body = r.body ? r.body : body;
          responseObject.body = renameKey(responseObject.body, 'raw', 'body');
          responseObject.body = responseObject.body.body;
          itemData.response = [responseObject];
          item.push(itemData);
        });

        const modelItemData = {
          name: null,
          description: null,
          item: null,
        };
        modelItemData.name = e.name;
        modelItemData.description = e.desc;
        modelItemData.item = item;
        mainItem.push(modelItemData);
      });
    }
    // main object
    mainObj.info = infoObj;
    mainObj.item = mainItem;

    // console.log(JSON.stringify(mainObj))
    return JSON.stringify(mainObj, null, 2);
    // for request end
  },
  async createCollectionV2_1 (info, platform = true) {
    const mainObj = {};
    const infoObj = {};

    const mainItem = [];
    // Project Details
    infoObj.name = info.project.name;
    infoObj._postman_id = uuid4();
    infoObj.description = info.project.description;
    infoObj.schema = 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json';

    const body = {
      mode: '',
      raw: '',
    };
    const header = [
      {
        key: 'Content-Type',
        value: 'application/json',
        description: '',
      },
    ];
    body.mode = 'raw';
    body.raw = '{}';

    if (platform) {
      info.item.forEach((e) => {
        const modelItem = [];
        e.item.forEach((ej) => {
          const item = [];
          ej.request?.forEach((r) => {
            const request = {
              url: '',
              method: '',
              header: null,
              body: null,
              description: '',
              auth: {},
            };
            const itemData = {
              name: '',
              request: null,
              response: null,
              _postman_isSubFolder: true,
            };
            request.url = postman.Url.parse(r.url);
            request.method = r.method;
            request.header = r.header ? r.header : header;
            request.auth = r.auth || {};
            // request.body = r.body ? r.body : body;
            if (r.body) {
              if (isEmpty(r.body.raw)) {
                r.body.raw = '{}';
              }
              request.body = r.body;
            } else {
              if (isEmpty(body.raw)) {
                body.raw = '{}';
              }
              request.body = body;
            }

            // set Item Data
            itemData.name = r.name;

            itemData.request = request;
            itemData.response = r.response;
            if (itemData.response?.length) {
              itemData.response[0].originalRequest.url = postman.Url.parse(r.response[0]?.originalRequest.url.raw);
            }
            item.push(itemData);
          });

          const modelItemData = {
            name: null,
            description: null,
            item: null,
          };
          modelItemData.name = ej.name;
          modelItemData.description = ej.desc;
          modelItemData.item = item;
          modelItem.push(modelItemData);
        });

        const mainItemData = {
          name: null,
          description: null,
          item: null,
        };
        mainItemData.name = e.name;
        mainItemData.description = e.description;
        mainItemData.item = modelItem;

        // main Item Data push into main Item

        mainItem.push(mainItemData);
      });
    } else {
      info.item.forEach((e) => {
        const item = [];
        e.request.forEach((r) => {
          const request = {
            url: '',
            method: '',
            header: null,
            body: null,
            description: '',
          };
          const itemData = {
            name: '',
            request: null,
            response: null,
          };
          request.url = postman.Url.parse(r.url);
          request.method = r.method;
          request.header = header;
          // request.body = r.body ? r.body : body;
          if (r.body) {
            if (isEmpty(r.body.raw)) {
              r.body.raw = '{}';
            }
            request.body = r.body;
          } else {
            if (isEmpty(body.raw)) {
              body.raw = '{}';
            }
            request.body = body;
          }
          // set Item Data
          itemData.name = r.name;

          itemData.request = request;
          itemData.response = r.response;
          item.push(itemData);
        });

        const modelItemData = {
          name: null,
          description: null,
          item: null,
        };
        modelItemData.name = e.name;
        modelItemData.description = e.desc;
        modelItemData.item = item;
        mainItem.push(modelItemData);
      });
    }
    // main object
    mainObj.info = infoObj;
    mainObj.item = mainItem;

    // console.log(JSON.stringify(mainObj))
    return JSON.stringify(mainObj, null, 2);
    // for request end
  },
};
