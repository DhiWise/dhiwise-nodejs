/* eslint-disable */
const { forEach, isEmpty, keys, isArray, assign, isObject, each, cloneDeep, find } = require('lodash');
const common = require('../utils/common');
const { MODEL_CONFIG_FOR_ROLE_PERMISSION, MODEL_FOR_ROLE_PERMISSION, SUPPORT_API, DEFAULT_ROLE, MODEL_FOR_ROLE_PERMISSION_SEQUELIZE, CHANGE_STRUCTURE_FIELD } = require('../../constants/constant')
const sortedObject = require('sorted-object');

function getKeyWord(methods) {
    if (methods === 'C') return 'create'
    if (methods === 'BC') return 'createBulk'
    if (methods === 'BU') return 'bulkUpdate'
}

const generateModelConfigInput = async (input) => {
    for (const platform of Object.keys(input)) {
        for (const model of Object.keys(input[platform])) {
            let newModel = {}
            for (let [key, value] of Object.entries(input[platform][model])) {
                if (key === 'R') {
                    newModel.findAll = {
                        isAuth: value.isAuth || false,
                        selected: true,
                        policy: []
                    }
                    newModel.findById = {
                        isAuth: value.isAuth || false,
                        selected: true,
                        policy: []
                    }
                    newModel.count = {
                        isAuth: value.isAuth || false,
                        selected: true,
                        policy: []
                    }
                }
                else if (key === 'U') {
                    newModel.update = {
                        isAuth: value.isAuth || false,
                        selected: true,
                        policy: []
                    }
                    newModel.partialUpdate = {
                        isAuth: value.isAuth || false,
                        selected: true,
                        policy: []
                    }
                } else if (key === 'HD') {
                    newModel.delete = {
                        isAuth: value.isAuth || false,
                        selected: true,
                        policy: []
                    }
                    newModel.deleteMany = {
                        isAuth: value.isAuth || false,
                        selected: true,
                        policy: []
                    }
                }
                else if (key === 'D') {
                    newModel.softDelete = {
                        isAuth: value.isAuth || false,
                        selected: true,
                        policy: []
                    }
                    newModel.softDeleteMany = {
                        isAuth: value.isAuth || false,
                        selected: true,
                        policy: []
                    }
                }
                else {
                    keyWord = getKeyWord(key);
                    newModel[keyWord] = {
                        isAuth: value.isAuth || false,
                        selected: true,
                        policy: []
                    }
                }
            }
            input[platform][model] = newModel;
        }
    }
    return input;
}

const generateFieldSelection = async (jsonData) => {
    let input = jsonData.newModelConfig;
    let platform = common.identifyPlatformNew(input, cloneDeep(jsonData.authentication.platform));
    let fieldSelection = {};
    for (let p in platform) {
        if (Object.keys(platform[p]).length === 0) {
            delete platform[p]
        }
    }
    for (const p of Object.keys(platform)) {
        platformObj = {}
        for (const model of Object.keys(platform[p])) {
            let modelObj = {};
            for (let [key, value] of Object.entries(platform[p][model])) {
                if (value.attributes && value.attributes.length) {
                    if (key === 'R') {
                        modelObj.findAll = {
                            selected: true,
                            fields: value.attributes
                        }
                        modelObj.count = {
                            selected: true,
                            fields: value.attributes
                        }
                        modelObj.findById = {
                            selected: true,
                            fields: value.attributes
                        }
                    }
                    else if (key === 'U') {
                        modelObj.update = {
                            selected: true,
                            fields: value.attributes
                        }
                        modelObj.partialUpdate = {
                            selected: true,
                            fields: value.attributes
                        }
                    }
                    else if (key === 'HD') {
                        modelObj.delete = {
                            selected: true,
                            fields: value.attributes
                        }
                        modelObj.deleteMany = {
                            selected: true,
                            fields: value.attributes
                        }
                    }
                    else if (key === 'D') {
                        modelObj.softDelete = {
                            selected: true,
                            fields: value.attributes
                        }
                        modelObj.softDeleteMany = {
                            selected: true,
                            fields: value.attributes
                        }
                    }
                    else {
                        let keyWord = getKeyWord(key);
                        modelObj[keyWord] = {
                            selected: true,
                            fields: value.attributes
                        }
                    }
                }
            }
            platformObj[model] = modelObj
        }
        fieldSelection[p] = platformObj
    }
    if (fieldSelection) {
        assign(jsonData, { fieldSelection });
    }
    return jsonData
}

const removeAuthPolicy = async (input) => {
    for (const platform of Object.keys(input)) {
        for (const model of Object.keys(input[platform])) {
            for (let [key, value] of Object.entries(input[platform][model])) {
                if (value.policy.length && value.policy.includes('auth')) {
                    value.policy = value.policy.filter(e => e != 'auth');
                }
            }
        }
    }
    return input;
}

const modelSequenceGeneratorParser = (models) => {
    const sequenceGenerator = {}
    forEach(models, (model, modelName) => {
        const attrWithSeq = {};
        forEach(keys(model), (attrName) => {
            if (model[attrName].isAutoIncrement) {
                attrWithSeq[attrName] = { isAutoIncrement: model[attrName].isAutoIncrement };
            }
            if (model[attrName].isAutoIncrement !== undefined)
                delete model[attrName].isAutoIncrement;
        });
        models[modelName] = model
        if (!isEmpty(attrWithSeq)) {
            sequenceGenerator[modelName] = sortedObject(attrWithSeq);
        }
    })
    return [models, sequenceGenerator]
}

const modelConfigParser = async (jsonData) => {

    // ? field Selection Object
    if (!isEmpty(jsonData.newModelConfig)) {
        jsonData = await generateFieldSelection(jsonData);
    }

    if (!isEmpty(jsonData.newModelConfig)) {
        let platform = common.identifyPlatformNew(jsonData.newModelConfig, cloneDeep(jsonData.authentication.platform));
        for (let p in platform) {
            if (Object.keys(platform[p]).length === 0) {
                delete platform[p]
            }
        }
        jsonData.modelConfig = await generateModelConfigInput(platform);
    }

    if (!isEmpty(jsonData.modelConfig)) {
        jsonData.modelConfig = await removeAuthPolicy(jsonData.modelConfig);
    }
    return jsonData;
}

// ? file upload parser
const fileUploadParser = async (jsonData) => {
    if (jsonData.fileUpload !== undefined && !isEmpty(jsonData.fileUpload)) {
        if (jsonData.fileUpload.uploads.length) {
            forEach(jsonData.fileUpload.uploads, u => {
                if (isEmpty(u.platform)) {
                    u.platform = jsonData.authentication.platform;
                }
            })
            const { uploads } = jsonData.fileUpload;
            jsonData.fileUpload.uploads = [];
            forEach(uploads, (u) => {
                let obj;
                forEach(u.platform, (p) => {
                    obj = { ...u };
                    obj.platform = p;
                    jsonData.fileUpload.uploads.push(obj);
                });
            });
        }
    }
    return jsonData;
}

const insertPassword = async (jsonData) => {
    if (!isEmpty(jsonData.authentication.authModel) && !isEmpty(jsonData.models[jsonData.authentication.authModel])) {
        if (isEmpty(jsonData.authentication.loginWith)) {
            jsonData.models[jsonData.authentication.authModel]['email'] = { type: 'String' }
            jsonData.models[jsonData.authentication.authModel]['password'] = { type: 'String' }
        }
        else {
            let modelKeys = Object.keys(jsonData.models[jsonData.authentication.authModel])
            if (isEmpty(jsonData.authentication.loginWith.username)) {
                jsonData.models[jsonData.authentication.authModel]['email'] = { type: 'String' }
            }
            else {
                if (!modelKeys.includes(jsonData.authentication.loginWith.password)) {
                    jsonData.models[jsonData.authentication.authModel][jsonData.authentication.loginWith.password] = { type: 'String' }
                }
            }
            if (isEmpty(jsonData.authentication.loginWith.password)) {
                jsonData.models[jsonData.authentication.authModel]['password'] = { type: 'String' }
            }
            else {
                forEach(jsonData.authentication.loginWith.username, u => {
                    if (!modelKeys.includes(u)) {
                        jsonData.models[jsonData.authentication.authModel][u] = { type: 'String' }
                    }
                })
            }
        }
    }
    return jsonData;
}
const sequelizeInsertPassword = async (jsonData) => {
    if (!isEmpty(jsonData.authentication.authModel) && !isEmpty(jsonData.models[jsonData.authentication.authModel])) {
        if (isEmpty(jsonData.authentication.loginWith)) {
            jsonData.models[jsonData.authentication.authModel]['email'] = { type: 'STRING' }
            jsonData.models[jsonData.authentication.authModel]['password'] = { type: 'STRING' }
        }
        else {
            let modelKeys = Object.keys(jsonData.models[jsonData.authentication.authModel])
            if (isEmpty(jsonData.authentication.loginWith.username)) {
                jsonData.models[jsonData.authentication.authModel]['email'] = { type: 'STRING' }
            }
            else {
                if (!modelKeys.includes(jsonData.authentication.loginWith.password)) {
                    jsonData.models[jsonData.authentication.authModel][jsonData.authentication.loginWith.password] = { type: 'STRING' }
                }
            }
            if (isEmpty(jsonData.authentication.loginWith.password)) {
                jsonData.models[jsonData.authentication.authModel]['password'] = { type: 'STRING' }
            }
            else {
                forEach(jsonData.authentication.loginWith.username, u => {
                    if (!modelKeys.includes(u)) {
                        jsonData.models[jsonData.authentication.authModel][u] = { type: 'STRING' }
                    }
                })
            }
        }
    }
    return jsonData;
}

const virtualRelationshipParser = async (models) => {
    const virtualRelationship = {};
    forEach(models, (model, modelName) => {
        virtualRelationship[modelName] = [];
        forEach(model, (fieldValue, fieldName) => {
            if (common.doesArrayContainSearchArray(keys(fieldValue), ['ref', 'foreignField', 'type']) && fieldValue?.type === "virtualRelation") {
                delete fieldValue.type;
                fieldValue.localField = fieldValue?.localField ?? "_id";
                fieldValue.justOne = false;
                virtualRelationship[modelName].push({ ...fieldValue, fieldName });
                delete model[fieldName];
            }
        });
        models[modelName] = model;
    });
    // remove empty arrays in virtual relationships object's keys
    forEach(virtualRelationship, (vr, key) => {
        if (vr.length === 0) {
            delete virtualRelationship[key];
        }
    });
    return [models, virtualRelationship];
}

const virtualRelationshipParserForSequelize = async (models) => {
    const virtualRelationship = {};
    forEach(models, (model, modelName) => {
        virtualRelationship[modelName] = [];
        forEach(model, (fieldValue, fieldName) => {
            if (common.doesArrayContainSearchArray(keys(fieldValue), ['ref', 'foreignField', 'localField', 'type'])) {
                delete fieldValue.type;
                fieldValue.justOne = false;
                virtualRelationship[modelName].push({ ...fieldValue, fieldName });
                delete model[fieldName];
                assign(models[fieldValue.ref], {
                    [fieldValue.foreignField]:
                    {
                        type: "Number"
                    }
                })

            }
        });
        models[modelName] = model;
    });
    // remove empty arrays in virtual relationships object's keys
    forEach(virtualRelationship, (vr, key) => {
        if (vr.length === 0) {
            delete virtualRelationship[key];
        }
    });
    return [models, virtualRelationship];
}

const addingModelKeys = async (jsonData) => {
    if (isEmpty(jsonData.authentication.authModule)) {
        jsonData.authentication.isAuthentication = false;
        //jsonData.authentication.authModel = jsonData.models.User ? 'User' : 'user'
    } else {
        jsonData.authentication.isAuthentication = true;
        jsonData.authentication.authModel = jsonData.authentication.authModule;
    }
    // jsonData.authentication.authModel = !isEmpty(jsonData.authentication.authModule) ? jsonData.authentication.authModule : 'user';
    if (jsonData.authentication.isAuthentication && isEmpty(jsonData.models[jsonData.authentication.authModel])) {
        jsonData.models[jsonData.authentication.authModel] = {
            "username": {
                "type": "String"
            },
            "password": {
                "type": "String"
            },
            "email": {
                "type": "String"
            },
            "name": {
                "type": "String"
            },
            "mobileNo": {
                "type": "Number"
            }
        }
    }
    if (jsonData.authentication.isAuthentication) {
        jsonData.models = {
            ...jsonData.models,
            userTokens: {
                userId: {
                    type: 'ObjectId',
                    ref: jsonData.authentication.authModel
                },
                token: {
                    type: 'String'
                },
                tokenExpiredTime: {
                    type: 'Date',
                },
                isTokenExpired: {
                    type: 'Boolean',
                    default: false,
                }
            }
        }
    }
    return jsonData;
}

const convertHookNames = (hooks) => {
    forEach(hooks, h => {
        if (h.pre?.length) {
            each(h.pre, pre => pre.operation = `before${findName(pre.operation)}`)
        }
        if (h.post?.length) {
            each(h.post, post => post.operation = `after${findName(post.operation)}`)
        }
    });
    return hooks;
}

const findName = (operation) => {
    let hookName = '';
    switch (operation) {
        case 'save':
            hookName = 'Create';
            break;
        case 'remove':
            hookName = 'Destroy';
            break;
        case 'validate':
            hookName = 'Validate';
            break;
        case 'find':
            hookName = 'Find';
            break;
        case 'init':
            hookName = 'Init';
            break;
        case 'updateOne':
            hookName = 'Update';
            break;
    }
    return hookName;
}


const allOperatorKeys = {
    $lt: '[Op.lt]',
    $lte: '[Op.lte]',
    $gt: '[Op.gt]',
    $ne: '[Op.ne]',
    $nin: '[Op.nin]',
    $in: '[Op.in]',
    $or: '[Op.or]',
    $and: '[Op.and]',
    $eq: '[Op.eq]',
    $regex: '[Op.regex]',
};
const replaceOperatorKeys = (obj) => {
    Object.entries(obj).forEach(([key, value]) => {
        if (isObject(value) && !isArray(value)) {
            replaceOperatorKeys(value);
        } else if (isArray(value)) {
            value.forEach((v) => {
                if (isObject(v) && !isArray(v)) {
                    replaceOperatorKeys(v);
                }
            });
        }
        delete obj[key];
        key = allOperatorKeys[key] ?? key;
        obj[key] = value;
    });
    return obj;
};
const parseFilterForSequelize = (filter) => {
    let result = replaceOperatorKeys(filter);
    result = JSON.stringify(result);
    result.replace(/\\"/g, '\uFFFF');
    result = result.replace(/"([^"]+)":/g, '$1:').replace(/\uFFFF/g, '\\\"');
    // console.log('result :>> ', result);
    return result;
};
const parseQueryBuildersForSequelize = (jsonData) => {
    let customRoutes = jsonData.routes && jsonData.routes.apis ? jsonData.routes : {}
    if (customRoutes.apis && customRoutes.apis.length) {
        for (let [index, crObj] of Object.entries(customRoutes.apis)) {
            if (crObj?.queryBuilder) {
                for (let [k, value] of Object.entries(crObj?.queryBuilder)) {
                    if (value?.filter) {
                        const temp = JSON.parse(value?.filter);
                        value.filter = parseFilterForSequelize(temp)
                        // console.log('value.filter :>> ', value.filter);
                        // const temp = JSON.parse(value?.filter);
                        // const result = recursion(temp, null)
                        // value.filter = result
                    }
                }
            }
        }
    }
    return customRoutes
}

const getMongoOperation = (val, modifier = null) => {
    let retVal = null;
    switch (val) {
        case "$lt":
            retVal = "[Op.lt]";
            break;
        case "$lte":
            retVal = "[Op.lte]";
            break;
        case "$gt":
            retVal = "[Op.gt]";
            break;
        case "$gte":
            retVal = "[Op.gte]";
            break;
        case "$ne":
            retVal = "[Op.ne]";
            break;
        case "$nin":
            retVal = "[Op.notIn]";
            break;
        case "$in":
            retVal = "[Op.in]";
            break;
        case "$or":
            retVal = "[Op.or]";
            break;
        case "$and":
            retVal = "[Op.and]";
            break;
        case "$eq":
            retVal = "[Op.eq]";
            break;
        case "$in":
            retVal = "[Op.in]";
            break;
        case '$nin':
            retVal = "[Op.notIn]";
            break;
        case "$regex":
            retVal = "[Op.regex]";
            break;
    }
    // return retVal ? retVal.replace(/['"]+/g, '') : retVal; 
    return retVal
}

function recursion(data, valueKey) {
    let query;
    let isNinArray = false
    if (!isArray(data) && isObject(data) && data.in) {
        data = data.in
    }
    if (!isArray(data) && isObject(data) && data.nin) {
        data = data.nin
        isNinArray = true
    }
    if (isArray(data)) {
        query = [];
        if (isNinArray) {
            query = { $nin: [] };
            each(data, (d) => {
                query.$nin.push(d);
            });
        }
        else if (typeof data[0] === 'string' && valueKey !== 'in') {
            query = { $in: [] };
            each(data, (d) => {
                query.$in.push(d);
            });
        }
        else {
            each(data, (d) => {
                query.push(recursion(d, valueKey));
            });
        }
    }
    else if (isObject(data)) {
        query = {};
        each(data, (v, k) => {
            let operation
            if (k && k == "contains") {
                query["$regex"] = getMongoOperation("like", "%" + v + "%")
                query["$options"] = "i";
            }
            else {
                operation = getMongoOperation(k);
                if (!operation) valueKey = k;
                query[operation || k] = recursion(v, valueKey);
            }
        });
    }
    else {
        query = data
    }
    return query;
}


const addingModelKeysSequelize = (jsonData) => {
    if (isEmpty(jsonData.authentication.authModule)) {
        jsonData.authentication.isAuthentication = false;
        //jsonData.authentication.authModel = jsonData.models.User ? 'User' : 'user'
    } else {
        jsonData.authentication.isAuthentication = true;
        jsonData.authentication.authModel = jsonData.authentication.authModule;
    }
    // jsonData.authentication.authModel = !isEmpty(jsonData.authentication.authModule) ? jsonData.authentication.authModule : 'user';
    if (jsonData.authentication.isAuthentication && isEmpty(jsonData.models[jsonData.authentication.authModel])) {
        jsonData.models[jsonData.authentication.authModel] = {
            "username": {
                "type": "STRING"
            },
            "password": {
                "type": "STRING"
            },
            "email": {
                "type": "STRING"
            },
            "name": {
                "type": "STRING"
            }
        }
    }
    if (jsonData.authentication.isAuthentication) {
        const userToken = {
            userId: {
                type: "INTEGER",
                ref: jsonData.authentication.authModel,
                refAttribute: 'id'
            },
            token: {
                type: 'STRING',
            },
            tokenExpiredTime: {
                type: 'DATE',
            },
            isTokenExpired: {
                type: 'BOOLEAN',
                default: false,
            },
        };

        const userAuthSettings = {
            userId: {
                type: "INTEGER",
                ref: jsonData.authentication.authModel,
                refAttribute: 'id'
            },
            loginOTP: {
                type: 'STRING',
            },
            expiredTimeOfLoginOTP: {
                type: 'DATE',
            },
            resetPasswordCode: {
                type: 'STRING',
            },
            expiredTimeOfResetPasswordCode: {
                type: 'DATE',
            },
            loginRetryLimit: {
                type: 'INTEGER',
                default: 0
            },
            loginReactiveTime: {
                "type": "DATE",
            }
        };
        Object.assign(jsonData.models, { userAuthSettings, userToken });
    }
    forEach(jsonData.models, model => {
        Object.assign(model, { isActive: { type: 'BOOLEAN' }, isDeleted: { type: 'BOOLEAN' } })
    })
    return jsonData;
}

// ? Parser for rolePermission
const parseRolePermission = (jsonData) => {
    const modelsForRolePermission = MODEL_FOR_ROLE_PERMISSION
    const modelConfigForRolePermission = MODEL_CONFIG_FOR_ROLE_PERMISSION
    let platformWiseRolePermission;
    // ? {model:{platform}} -> {platform:{model}}
    if (!isEmpty(jsonData.rolePermission)) {
        platformWiseRolePermission = common.identifyPlatform(jsonData.rolePermission);
        for (let p in platformWiseRolePermission) {
            if (Object.keys(platformWiseRolePermission[p]).length === 0) {
                delete platformWiseRolePermission[p]
            }
        }
        jsonData.rolePermission = platformWiseRolePermission;
        forEach(platformWiseRolePermission, (platformObj, platformName) => {
            forEach(platformObj, (modelObj, modelName) => {
                let newObj = {}
                forEach(modelObj, (roleArray, method) => {
                    if (method === 'R') {
                        assign(newObj, { 'findAll': roleArray })
                        assign(newObj, { 'findById': roleArray })
                        assign(newObj, { 'count': roleArray })
                    } else if (method === 'U') {
                        assign(newObj, { 'update': roleArray })
                        assign(newObj, { 'partialUpdate': roleArray })
                    } else {
                        const keyword = getKeyWord(method)
                        assign(newObj, { [keyword]: roleArray })
                    }
                });
                platformObj[modelName] = newObj;
            });
        });
        assign(jsonData.models, modelsForRolePermission)
        assign(jsonData.modelConfig.admin, modelConfigForRolePermission)
    }
    return jsonData;
}

const addSystemUserToRolePermission = (jsonData) => {
    const insertedRolePermission = cloneDeep(jsonData.rolePermission)
    const modelsInRolePermission = Object.keys(insertedRolePermission)
    const insertedModels = Object.keys(jsonData?.models)
    const supportedAPIs = SUPPORT_API
    forEach(insertedModels, (model) => {
        if (modelsInRolePermission.includes(model)) {
            forEach(supportedAPIs, (api) => {
                if (insertedRolePermission[model] && insertedRolePermission[model][api]) {
                    insertedRolePermission[model][api].push(DEFAULT_ROLE)
                } else {
                    Object.assign(insertedRolePermission[model], { [api]: [DEFAULT_ROLE] })
                }
            })
        } else {
            Object.assign(insertedRolePermission, { [model]: {} })
            forEach(supportedAPIs, (api) => {
                Object.assign(insertedRolePermission[model], { [api]: [DEFAULT_ROLE] })
            })
        }
    })
    return insertedRolePermission;
}

const parseRolePermissionNew = (jsonData) => {
    let platformWiseRolePermission = {};
    // ? {model:{platform}} -> {platform:{model}}
    if (!isEmpty(jsonData.rolePermission)) {
        jsonData.rolePermission = addSystemUserToRolePermission(jsonData)
        const tempRolePermission = cloneDeep(jsonData.rolePermission)
        const supportedPlatform = cloneDeep(jsonData.authentication.platform)
        for (let i = 0; i < supportedPlatform.length; i++) {
            Object.assign(platformWiseRolePermission, { [supportedPlatform[i]]: cloneDeep(tempRolePermission) })
        }
        jsonData.rolePermission = platformWiseRolePermission;
        forEach(platformWiseRolePermission, (platformObj, platformName) => {
            forEach(platformObj, (modelObj, modelName) => {
                let newObj = {}
                forEach(modelObj, (roleArray, method) => {
                    if (method === 'R') {
                        assign(newObj, { 'findAll': roleArray })
                        assign(newObj, { 'findById': roleArray })
                        assign(newObj, { 'count': roleArray })
                    } else if (method === 'U') {
                        assign(newObj, { 'update': roleArray })
                        assign(newObj, { 'partialUpdate': roleArray })
                    } else if (method === 'HD') {
                        assign(newObj, { 'delete': roleArray })
                        assign(newObj, { 'deleteMany': roleArray })
                    }
                    else if (method === 'D') {
                        assign(newObj, { 'softDelete': roleArray })
                        assign(newObj, { 'softDeleteMany': roleArray })
                    } else {
                        const keyword = getKeyWord(method)
                        assign(newObj, { [keyword]: roleArray })
                    }
                });
                platformObj[modelName] = newObj;
            });
        });
    }
    return jsonData;
}

const addRolePermissionMongoModels = (jsonData) => {
    assign(jsonData.models, MODEL_FOR_ROLE_PERMISSION)
    jsonData.models.userRole.userId.ref = jsonData.authentication.authModel
    if (!isEmpty(jsonData.authentication) && !isEmpty(jsonData.authentication.platform)) {
        const platforms = jsonData.authentication.platform
        if (platforms.includes('admin')) {
            assign(jsonData.modelConfig.admin, MODEL_CONFIG_FOR_ROLE_PERMISSION)
        } else {
            forEach(platforms, (platform) => {
                assign(jsonData.modelConfig[`${platform}`], MODEL_CONFIG_FOR_ROLE_PERMISSION)
            })
        }
    }
    return jsonData
}

const addRolePermissionSQLModels = (jsonData) => {
    assign(jsonData.models, MODEL_FOR_ROLE_PERMISSION_SEQUELIZE)
    jsonData.models.userRole.userId.ref = jsonData.authentication.authModel
    if (!isEmpty(jsonData.authentication) && !isEmpty(jsonData.authentication.platform)) {
        const platforms = jsonData.authentication.platform
        if (platforms.includes('admin')) {
            assign(jsonData.modelConfig.admin, MODEL_CONFIG_FOR_ROLE_PERMISSION)
        } else {
            forEach(platforms, (platform) => {
                assign(jsonData.modelConfig[`${platform}`], MODEL_CONFIG_FOR_ROLE_PERMISSION)
            })
        }
    }
    return jsonData
}

const addPlatformsForThirdParty = (input, authentication) => {
    let updated = [];
    input.map(i => {
        if (isEmpty(i.platforms)) {
            i = {
                ...i,
                platforms: authentication.platform
            }
        }
        updated.push(i);
    })
    return updated;
}

const replaceControllerNameInCustomRoutes = (jsonData) => {
    if (jsonData.models) {
        const models = Object.keys(jsonData.models)
        const lower_models = models.map(model => model.toLowerCase())
        if (jsonData && jsonData.routes) {
            const routes = jsonData.routes.apis && jsonData.routes.apis.length ? jsonData.routes.apis : []
            if (routes && routes.length) {
                Object.keys(routes).forEach(function (index) {
                    if (!isEmpty(routes[index].controller)) {
                        if (lower_models.includes((routes[index].controller).toLowerCase())) {
                            const matchedModel = models.find((model) => model.toLowerCase() === (routes[index].controller).toLowerCase())
                            if (!isEmpty(matchedModel)) {
                                routes[index].controller = matchedModel
                                routes[index].service = matchedModel
                            }

                        }
                    }
                })
            }
        }
    }

    return jsonData
}
const parseCustomRoute = (jsonData) => {
    if (jsonData && jsonData?.routes && jsonData?.models) {
        const models = Object.keys(jsonData.models)
        const routes = jsonData.routes.apis && jsonData.routes.apis.length ? jsonData.routes.apis : []
        if (routes && routes.length) {
            Object.keys(routes).forEach(function (index) {
                if (isEmpty(routes[index].model)) {
                    if (models.includes(routes[index].controller)) {
                        routes[index].model = routes[index].controller
                        routes[index].createNewFile = false
                    } else {
                        if (isEmpty(routes[index].controllerFilePath) && isEmpty(routes[index].controllerFileName)) {
                            if (!isEmpty(routes[index].model)) {
                                routes[index].createNewFile = false
                            } else {
                                routes[index].createNewFile = true
                            }
                        } else {
                            routes[index].createNewFile = false
                        }
                    }
                } else {
                    routes[index].createNewFile = false
                }
            })
        }
    }
    return jsonData
}


const sequelizeJSONParserForIDAndAutoIncrement = (jsonData) => {
    if (jsonData && jsonData?.models) {
        const jsonModels = {};
        forEach(jsonData?.models, (value, key) => {
            if (!('id' in value)) {
                value = {
                    id: {
                        type: 'INTEGER',
                        autoIncrement: true,
                        primaryKey: true,
                    },
                    ...value,
                };
            }
            if ('id' in value) {
                if (!('primaryKey' in value.id)) {
                    value.id.primaryKey = true;
                }
                if (!('autoIncrement' in value.id)) {
                    value.id.autoIncrement = true;
                }
            }
            let isAutoIncrementInModel = false;
            const incrementKeyArray = [];
            const autoIncrementKeyArray = [
                'INTEGER',
                'FLOAT',
                'DECIMAL',
                'BIGINT',
            ];
            Object.keys(value).map((e) => {
                if (value[e].autoIncrement) {
                    if (!autoIncrementKeyArray.includes(value[e].type)) {
                        delete value[e].autoIncrement;
                    } else {
                        isAutoIncrementInModel = true;
                        incrementKeyArray.push(e);
                    }
                    if (incrementKeyArray.length > 1 && isAutoIncrementInModel) {
                        delete value[e].autoIncrement;
                    }
                }
            });
            Object.assign(jsonModels, { [key]: value });
        });
        jsonData.models = jsonModels;
        return jsonData;
    }
    return jsonData;
}

// ? Parser for NestedCall
const parseNestedCallInput = (nestedCalls, platforms) => {
    let platformWiseNestedCalls;
    // ? {model:{platform}} -> {platform:{model}}
    if (!isEmpty(nestedCalls)) {
        platformWiseNestedCalls = common.identifyPlatformNew(nestedCalls, platforms);
        for (let p in platformWiseNestedCalls) {
            if (Object.keys(platformWiseNestedCalls[p]).length === 0) {
                delete platformWiseNestedCalls[p]
            }
        }
    }
    // make changes in C,R,U,D,HD,BU,BC
    for (let [platform, model] of Object.entries(platformWiseNestedCalls)) {
        for (let [modelName, nestedCallInMethod] of Object.entries(model)) {
            let newNestedCall = {}
            for (let [methodName, nestedCall] of Object.entries(nestedCallInMethod)) {

                if (methodName === 'R') {
                    Object.assign(newNestedCall, { 'findAll': parsePrePostOfNestedCall(nestedCall) })
                } else if (methodName === 'U') {
                    Object.assign(newNestedCall, { 'update': parsePrePostOfNestedCall(nestedCall) })
                } else if (methodName === 'SR') {
                    Object.assign(newNestedCall, { 'findById': parsePrePostOfNestedCall(nestedCall) })
                }
                else if (methodName === 'HD') {
                    Object.assign(newNestedCall, { 'delete': parsePrePostOfNestedCall(nestedCall) })
                }
                else if (methodName === 'D') {
                    Object.assign(newNestedCall, { 'softDelete': parsePrePostOfNestedCall(nestedCall) })
                }
                else if (methodName === "count") {
                    Object.assign(newNestedCall, { [methodName]: parsePrePostOfNestedCall(nestedCall) })
                } else {
                    const keyword = getKeyWord(methodName)
                    Object.assign(newNestedCall, { [keyword]: parsePrePostOfNestedCall(nestedCall) })
                }
            }
            platformWiseNestedCalls[platform][modelName] = newNestedCall
        }
    }
    return platformWiseNestedCalls
}

// ? Parser for PRE_POST of NestedCall
const parsePrePostOfNestedCall = (nestedCalls) => {
    for (let [pre_post, nestedCall] of Object.entries(nestedCalls)) {
        let newNestedCall = []
        for (let i = 0; i < nestedCall.length; i++) {
            if (nestedCall[i].method !== 'codeBlock' && nestedCall[i].method !== 'customQuery') {
                if (nestedCall[i].method === 'U') {
                    nestedCall[i].method = 'update'
                } else if (nestedCall[i].method === 'R') {
                    nestedCall[i].method = 'findAll'
                }
                else if (nestedCall[i].method === 'SR') {
                    nestedCall[i].method = 'findById'
                }
                else if (nestedCall[i].method === 'HD') {
                    nestedCall[i].method = 'delete'
                }
                else if (nestedCall[i].method === 'D') {
                    nestedCall[i].method = 'softDelete'
                }
                else if ("count" === nestedCall[i].method) {
                    nestedCall[i].method = "count"
                } else {
                    nestedCall[i].method = getKeyWord(nestedCall[i].method)
                }
            }
            newNestedCall.push(nestedCall[i])
        }
        nestedCalls[pre_post] = newNestedCall
    }
    return nestedCalls
}
module.exports = {
    modelSequenceGeneratorParser,
    modelConfigParser,
    fileUploadParser,
    insertPassword,
    virtualRelationshipParser,
    addingModelKeys,
    virtualRelationshipParserForSequelize,
    convertHookNames,
    parseQueryBuildersForSequelize,
    addingModelKeysSequelize,
    parseRolePermission,
    parseRolePermissionNew,
    addRolePermissionMongoModels,
    addRolePermissionSQLModels,
    parseCustomRoute,
    sequelizeInsertPassword,
    replaceControllerNameInCustomRoutes,
    sequelizeJSONParserForIDAndAutoIncrement,
    parseNestedCallInput
};
