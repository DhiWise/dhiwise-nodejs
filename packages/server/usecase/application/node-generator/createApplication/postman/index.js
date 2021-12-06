/* eslint-disable */
/* global MESSAGE, _ */
const uuid4 = require('uuid').v4;
const fakeData = require('../generateFakeData/index');
const { APIS} = require('../../constants/constant');
const { forEach, values, isEmpty, create, keys } = require('lodash');
const fakerStatic = require('faker');
let dayjs = require('dayjs');
async function getPlatformFromSchemaDynamic(jsonData, modelConfig, model) {
    const platformNames = jsonData.authentication.platform;
    const platformWiseModelSchema = {}
    forEach(platformNames, (platformName) => {
        platformWiseModelSchema[platformName] = (modelConfig[platformName] ? modelConfig[platformName][model] : undefined)
    })
    return platformWiseModelSchema
}
async function getPostmanCollectionsForLogin(platformStr, userModel, loginWith, fakeModel, port, addDataFormate, value, modelPrivateAttribute, formateModel) {
    if (addDataFormate) {
        let boolKeys = []; let dateKeys = [];
        if (addDataFormate['allModels_data_format']) {
            for (let index in value) {
                if (value[index].type === "Boolean") {
                    boolKeys.push(index);
                } if (value[index].type === "Date") {
                    dateKeys.push(index);
                }
            }
            if (addDataFormate[formateModel]) {
                Array.prototype.push.apply(addDataFormate[formateModel], addDataFormate['allModels_data_format']);
            } else {
                addDataFormate[formateModel] = addDataFormate['allModels_data_format'];
            }
        }
        boolKeys = [];
        dateKeys = [];
    }
    let data = {
        username: 'username',
        password: 'password',
    };
    const changePass = {
        oldPassword: 'OldPassword',
        newPassword: 'NewPassword',
    };
    const objectId = fakeData.getObjectId();
    const platformObj = {
        name: 'login',
        desc: `${platformStr} Login`,
        request: [],
    };
    let requestObj = {};
    let body = {};
    body.mode = 'raw';
    requestObj.name = `Login in ${platformStr}`;
    requestObj.method = 'POST';
    requestObj.url = `{{url}}/${platformStr.toLowerCase()}/auth/login`;
    body.raw = JSON.stringify(data, undefined, 2);
    requestObj.body = body;
    let resObject = _.cloneDeep(fakeModel[userModel]);
    if (!('id' in resObject)) {
        Object.assign(resObject, { id: objectId });
    }
    if (!('loginRetryLimit' in resObject)) {
        Object.assign(resObject, { loginRetryLimit: 0 });
    }
    if (!('token' in resObject)) {
        Object.assign(resObject, { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMWRlZDVjMGFjMjAxMmFjMDI4ODkxZiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2MjkzNTEyNzAsImV4cCI6MTYyOTk1MTI3MH0.BJ-WKjNYeFDQ4pn8kfli5gwn6GLz_c3voFht20Agj9k" });
    }
    Object.assign(resObject,
        {
            createdAt: fakerStatic.date.future(),
            updatedAt: fakerStatic.date.future(),
            isDeleted: false,
            isActive: true
        });
    if (addDataFormate && addDataFormate[formateModel]) {
        resObject = await filterResponseBasedOnFormate(addDataFormate[formateModel], resObject);
    }

    if (Object.keys(modelPrivateAttribute).length) {
        resObject = await removePrivateAttibutesFromResponse(resObject, modelPrivateAttribute)
    }
    let jsonData = {
        "status": "SUCCESS",
        "message": "Login Successful",
        "data": resObject
    };
    let responseObject = {};
    responseObject.name = `Login in ${platformStr}_response`;
    responseObject.originalRequest = {
        method: 'POST',
        header: [],
        url: {
            raw: requestObj.url,
        },
    };
    responseObject.status = 'OK';
    responseObject.code = 200;
    responseObject._postman_previewlanguage = 'json';
    responseObject.body = JSON.stringify(jsonData, undefined, 2);
    responseObject.header = [
        { "key": "Content-Type", "value": "application/json" }
    ];
    responseObject.cookie = [];
    requestObj.response = [responseObject];
    platformObj.request.push(requestObj);
    requestObj = {};
    body = {};
    body.mode = "raw"
    requestObj.name = `Register User in ${platformStr}`
    requestObj.method = "POST"
    requestObj.url = `{{url}}/${platformStr.toLowerCase()}/auth/register`;
    body.raw = JSON.stringify(fakeModel[userModel], undefined, 2);
    requestObj.body = body;
    resObject = _.cloneDeep(fakeModel[userModel]);
    if (!('id' in resObject)) {
        Object.assign(resObject, { id: objectId });
    }
    if (!('loginRetryLimit' in resObject)) {
        Object.assign(resObject, { loginRetryLimit: 0 });
    }
    Object.assign(resObject,
        {
            createdAt: fakerStatic.date.future(),
            updatedAt: fakerStatic.date.future(),
            isDeleted: false,
            isActive: true
        });
    if (addDataFormate && addDataFormate[formateModel]) {
        resObject = await filterResponseBasedOnFormate(addDataFormate[formateModel], resObject);
    }
    if (addDataFormate && addDataFormate[formateModel]) {
        resObject = await filterResponseBasedOnFormate(addDataFormate[formateModel], resObject);
    }

    if (Object.keys(modelPrivateAttribute).length) {
        resObject = await removePrivateAttibutesFromResponse(resObject, modelPrivateAttribute)
    }
    jsonData = {
        "status": "SUCCESS",
        "message": "Your request is successfully executed",
        "data": resObject
    };
    responseObject = {};
    responseObject.name = `Register User in ${platformStr}_response`;
    responseObject.originalRequest = {
        method: 'POST',
        header: [],
        url: {
            raw: requestObj.url,
        },
    };
    responseObject.status = 'OK';
    responseObject.code = 200;
    responseObject._postman_previewlanguage = 'json';
    responseObject.body = JSON.stringify(jsonData, undefined, 2);
    responseObject.header = [
        { "key": "Content-Type", "value": "application/json" }
    ];
    responseObject.cookie = [];
    requestObj.response = [responseObject];
    platformObj.request.push(requestObj);

    requestObj = {};
    body = {};
    body.mode = 'raw';
    requestObj.name = `Forgot Password in ${platformStr}`;
    requestObj.method = 'POST';
    requestObj.url = `{{url}}/${platformStr.toLowerCase()}/auth/forgot-password`;
    body.raw = JSON.stringify({
        email: 'yourmail@gmail.com',
    }, undefined, 2);
    requestObj.body = body;
    const jsonDataForgetPassword = {
        "status": "SUCCESS",
        "message": "Your request is successfully executed",
        "data": "otp successfully send to your email."
    };
    const responseObjectForgetPassword = {};
    responseObjectForgetPassword.name = `Forgot Password in ${platformStr}_response`;
    responseObjectForgetPassword.originalRequest = {
        method: 'POST',
        header: [],
        url: {
            raw: requestObj.url,
        },
    };
    responseObjectForgetPassword.status = 'OK';
    responseObjectForgetPassword.code = 200;
    responseObjectForgetPassword._postman_previewlanguage = 'json';
    responseObjectForgetPassword.body = JSON.stringify(jsonDataForgetPassword, undefined, 2);
    responseObjectForgetPassword.header = [];
    responseObjectForgetPassword.cookie = [];
    requestObj.response = [responseObjectForgetPassword];
    platformObj.request.push(requestObj);

    requestObj = {};
    body = {};
    body.mode = 'raw';
    requestObj.name = `Validate OTP in ${platformStr}`;
    requestObj.method = 'POST';
    requestObj.url = `{{url}}/${platformStr.toLowerCase()}/auth/validate-otp`;
    body.raw = JSON.stringify({
        otp: '5898',
    }, undefined, 2);
    requestObj.body = body;
    const validateOTPResponse = {
        "status": "SUCCESS",
        "message": "Your request is successfully executed",
        "data": "Invalid OTP"
    };
    const responseObjectValidateOTP = {};
    responseObjectValidateOTP.name = `Validate OTP in ${platformStr}_response`;
    responseObjectValidateOTP.originalRequest = {
        method: 'POST',
        header: [],
        url: {
            raw: requestObj.url,
        },
    };
    responseObjectValidateOTP.status = 'OK';
    responseObjectValidateOTP.code = 200;
    responseObjectValidateOTP._postman_previewlanguage = 'json';
    responseObjectValidateOTP.body = JSON.stringify(validateOTPResponse, undefined, 2);
    responseObjectValidateOTP.header = [];
    responseObjectValidateOTP.cookie = [];
    requestObj.response = [responseObjectValidateOTP];

    platformObj.request.push(requestObj);

    const header = [];
    const security = {
        "type": "bearer",
        "bearer": {
            "token": "{{token}}"
        }
    }
    header.push({
        key: 'Content-Type',
        value: 'application/json',
        description: '',
    });
    requestObj = {};
    body = {};
    body.mode = 'raw';
    requestObj.name = `Logout in ${platformStr}`;
    requestObj.method = 'POST';
    requestObj.url = `{{url}}/${platformStr.toLowerCase()}/auth/logout`;
    body.raw = JSON.stringify({});
    requestObj.body = body;
    requestObj.header = header;
    requestObj.auth = security;
    platformObj.request.push(requestObj);

    requestObj = {};
    body = {};
    body.mode = 'raw';
    requestObj.name = `Change Password in ${platformStr}`;
    requestObj.method = 'PUT';
    requestObj.url = platformStr.toLowerCase() !== 'admin'
        ? `{{url}}/${platformStr.toLowerCase()}/api/v1/${userModel.toLowerCase()}/change-password`
        : `{{url}}/${platformStr.toLowerCase()}/${userModel.toLowerCase()}/change-password`;
    body.raw = JSON.stringify(changePass, undefined, 2);
    requestObj.body = body;
    requestObj.header = header;
    requestObj.auth = security;
    if (!('id' in resObject)) {
        Object.assign(resObject, { id: objectId });
    }
    if (!('loginTry' in resObject)) {
        Object.assign(resObject, { loginTry: 0 });
    }
    const changePasswordResponse = {
        "status": "SUCCESS",
        "message": "Password changed successfully",
        "data": null

    };
    const responseForChangePassword = {};
    responseForChangePassword.name = `Change Password in ${platformStr}_response`;
    responseForChangePassword.originalRequest = {
        method: 'POST',
        header: [],
        url: {
            raw: requestObj.url,
        },
    };
    responseForChangePassword.status = 'OK';
    responseForChangePassword.code = 200;
    responseForChangePassword._postman_previewlanguage = 'json';
    responseForChangePassword.body = JSON.stringify(changePasswordResponse, undefined, 2);
    responseForChangePassword.header = [];
    responseForChangePassword.cookie = [];
    requestObj.response = [responseForChangePassword];
    platformObj.request.push(requestObj);

    requestObj = {};
    body = {};
    body.mode = 'raw';
    requestObj.name = `Reset password in ${platformStr}`;
    requestObj.method = 'PUT';
    requestObj.url = `{{url}}/${platformStr.toLowerCase()}/auth/reset-password`;
    body.raw = JSON.stringify({
        code: '5898',
        newPassword: 'yourPassword',
    }, undefined, 2);
    requestObj.body = body;
    const resetPasswordResponse = {
        "status": "SUCCESS",
        "message": "Your request is successfully executed",
        "data": "Password reset successfully"
    };
    const responseForResetPassword = {};
    responseForResetPassword.name = `Reset password in ${platformStr}_response~`;
    responseForResetPassword.originalRequest = {
        method: 'POST',
        header: [],
        url: {
            raw: requestObj.url,
        },
    };
    responseForResetPassword.status = 'OK';
    responseForResetPassword.code = 200;
    responseForResetPassword._postman_previewlanguage = 'json';
    responseForResetPassword.body = JSON.stringify(resetPasswordResponse, undefined, 2);
    responseForResetPassword.header = [];
    responseForResetPassword.cookie = [];
    requestObj.response = [responseForResetPassword];
    platformObj.request.push(requestObj);

    return platformObj;
}
async function getPostmanCollectionForSocialLogin(platform, details) {
    const platformObj = {
        name: 'Social Login',
        desc: 'Login Through Social Accounts',
        request: [],
    };
    let requestObj = {};
    let body = {};
    for (let i = 0; i < details.length; i += 1) {
        requestObj = {};
        body = {};
        body.mode = 'raw';
        requestObj.name = `Social Login through ${details[i].toLowerCase()}`;
        requestObj.method = 'GET';
        requestObj.url = `{{url}}/${platform.toLowerCase()}/auth/${details[i].toLowerCase()}`;
        body.raw = '{}';
        requestObj.body = body;
        platformObj.request.push(requestObj);
    }

    return platformObj;
}
async function setCustomRoutes(customObj) {
    try {
        let newPlatform = {
            name: "common",
            description: "Common routes",
            item: []
        }
        const port = customObj.port;
        if (customObj.notification.length) {
            let platformObj = {
                name: `webNotificationsRoutes`,
                desc: "",
                request: []
            }
            let requestObj = {}
            let body = {}
            body.mode = "raw"
            requestObj.name = `create Notification`;
            requestObj.method = `POST`
            requestObj.url = `{{url}}/common/api/v1/notification/create`
            body.raw = "{}"
            requestObj.body = body;
            platformObj.request.push(requestObj);

            requestObj = {}
            body = {}

            body.mode = "raw"
            requestObj.name = `Mark as read`;
            requestObj.method = `PUT`
            requestObj.url = `{{url}}/common/api/v1/notification/markAsRead`
            body.raw = "{}"
            requestObj.body = body;
            platformObj.request.push(requestObj);

            requestObj = {}
            body = {}

            body.mode = "raw"
            requestObj.name = `Mark as Visited`;
            requestObj.method = `PUT`
            requestObj.url = `{{url}}/common/api/v1/notification/markAsVisited`
            body.raw = "{}"
            requestObj.body = body;
            platformObj.request.push(requestObj);
            newPlatform.item.push(platformObj);
        }
        // if (!_.isEmpty(customObj.fileObj)) {
        //     newPlatform.item.push(await getPostmanCollectionForFileUpload("common", customObj.fileObj, customObj.port));
        // }

        return newPlatform;
    } catch (error) {
        throw error;
    }
}
async function getPostmanCollections(platformStr, key, platform, data = {}, isRole = false, isAuth, port, currentPostmanCollectionDetails = {}, addDataFormate, value, modelPrivateAttribute) {
    if (addDataFormate) {
        let boolKeys = []; let dateKeys = [];
        if (addDataFormate['allModels_data_format']) {
            for (let index in value) {
                if (value[index].type === "Boolean") {
                    boolKeys.push(index);
                } if (value[index].type === "Date") {
                    dateKeys.push(index);
                }
            }
            if (addDataFormate[key]) {
                Array.prototype.push.apply(addDataFormate[key], addDataFormate['allModels_data_format']);
            } else {
                addDataFormate[key] = addDataFormate['allModels_data_format'];
            }
        }
        boolKeys = [];
        dateKeys = [];
    }

    let platformObj = {
        name: key,
        desc: `${key} Model APIs`,
        request: [],
    };

    const id = ":id";
    delete data[key].id;
    if (isRole) {
        data[key].role = 1;
    }

    for (let [api, value] of Object.entries(platform)) {
        if (APIS.includes(api) && value.selected) {
            let requestObj = {};
            let body = {};
            const header = [];
            header.push({
                key: 'Content-Type',
                value: 'application/json',
                description: '',
            });
            let security = {};
            if (value.isAuth && isAuth) {
                security = {
                    "type": "bearer",
                    "bearer": {
                        "token": "{{token}}"
                    }
                }
            }
            if (api === 'create') {
                let body = {};
                body.mode = 'raw';
                requestObj.name = `add${key}`;
                requestObj.method = 'POST';
                requestObj.url = platformStr.toLowerCase() !== 'admin'
                    ? `{{url}}/${platformStr.toLowerCase()}/api/v1/${key.toLowerCase()}/create`
                    : `{{url}}/${platformStr.toLowerCase()}/${key.toLowerCase()}/create`;
                body.raw = JSON.stringify(data[key], undefined, 2);
                requestObj.body = body;
                header.length ? requestObj.header = header : '';
                requestObj.auth = security
                const responseObject = {};
                responseObject.name = `add${key}_response`;
                responseObject.originalRequest = {
                    method: 'POST',
                    header: [],
                    url: {
                        raw: requestObj.url,
                    },
                };
                responseObject.status = 'OK';
                responseObject.code = 200;
                responseObject._postman_previewlanguage = 'json';
                let createBody = _.cloneDeep(JSON.parse(body.raw));
                const id = fakeData.getObjectId();
                if (!('id' in createBody)) {
                    Object.assign(createBody, { id: id });
                }
                Object.assign(createBody,
                    {
                        createdAt: fakerStatic.date.future(),
                        updatedAt: fakerStatic.date.future(),
                        isDeleted: false,
                        isActive: true
                    });
                if (addDataFormate && addDataFormate[key]) {
                    createBody = await filterResponseBasedOnFormate(addDataFormate[key], createBody);
                }
                if (Object.keys(modelPrivateAttribute).length) {
                    createBody = await removePrivateAttibutesFromResponse(createBody, modelPrivateAttribute)
                }
                const projectionFields = currentPostmanCollectionDetails[api];
                let selectedFields = [];
                if (projectionFields) {
                    selectedFields = projectionFields.fields;
                }
                if (selectedFields && selectedFields.length) {
                    Object.keys(createBody).map(keys => {
                        if (!selectedFields.includes(keys)) {
                            delete createBody[keys];
                        }
                    })
                }
                let responseJsonData = {
                    "status": "SUCCESS",
                    "message": "Your request is successfully executed",
                    "data": createBody
                };
                responseJsonData = JSON.stringify(responseJsonData, undefined, 2)
                responseObject.body = responseJsonData;
                responseObject.header = [
                    { "key": "Content-Type", "value": "application/json" }
                ];
                responseObject.cookie = [];
                requestObj.response = [responseObject];
                platformObj.request.push(requestObj);
            }
            if (api === 'createBulk') {
                requestObj.name = `insertBulk${key}`;
                requestObj.method = 'POST';
                requestObj.url = platformStr.toLowerCase() !== 'admin' ?
                    `{{url}}/${platformStr.toLowerCase()}/api/v1/${key.toLowerCase()}/addBulk` :
                    `{{url}}/${platformStr.toLowerCase()}/${key.toLowerCase()}/addBulk`;
                const arr = [];
                const objBulk = {};
                arr.push(data[key]);
                objBulk.data = arr;
                body.mode = 'raw';
                body.raw = JSON.stringify(objBulk, undefined, 2);
                requestObj.body = body;
                header.length ? requestObj.header = header : '';
                requestObj.auth = security
                const responseObject = {};
                responseObject.name = `insertBulk${key}_response`;
                responseObject.originalRequest = {
                    method: 'POST',
                    header: [],
                    url: {
                        raw: requestObj.url,
                    },
                };
                responseObject.status = 'OK';
                responseObject.code = 200;
                responseObject._postman_previewlanguage = 'json';
                let createBody = _.cloneDeep(data[key]);
                const id = fakeData.getObjectId();
                if (!('id' in createBody)) {
                    Object.assign(createBody, { id: id });
                }
                Object.assign(createBody,
                    {
                        createdAt: fakerStatic.date.future(),
                        updatedAt: fakerStatic.date.future(),
                        isDeleted: false,
                        isActive: true
                    });
                if (addDataFormate && addDataFormate[key]) {
                    createBody = await filterResponseBasedOnFormate(addDataFormate[key], createBody);
                }
                if (Object.keys(modelPrivateAttribute).length) {
                    createBody = await removePrivateAttibutesFromResponse(createBody, modelPrivateAttribute)
                }
                const projectionFields = currentPostmanCollectionDetails[api];
                let selectedFields = [];
                if (projectionFields) {
                    selectedFields = projectionFields.fields;
                }
                if (selectedFields && selectedFields.length) {
                    Object.keys(createBody).map(keys => {
                        if (!selectedFields.includes(keys)) {
                            delete createBody[keys];
                        }
                    });
                }
                let responseJsonData = {
                    "status": "SUCCESS",
                    "message": "Your request is successfully executed",
                    "data": [createBody]
                };
                responseJsonData = JSON.stringify(responseJsonData, undefined, 2)
                responseObject.body = responseJsonData;
                responseObject.header = [
                    { "key": "Content-Type", "value": "application/json" }
                ];
                responseObject.cookie = [];
                requestObj.response = [responseObject];
                platformObj.request.push(requestObj);
            }
            if (api === 'findAll') {
                let findAllFakeobj = fakeData.getFindAllObject();
                requestObj.name = `findAll${key}`;
                requestObj.method = 'POST';
                requestObj.url = platformStr.toLowerCase() !== 'admin' ?
                    `{{url}}/${platformStr.toLowerCase()}/api/v1/${key.toLowerCase()}/list` :
                    `{{url}}/${platformStr.toLowerCase()}/${key.toLowerCase()}/list`;
                body.mode = 'raw';
                body.raw = JSON.stringify(findAllFakeobj, undefined, 2);
                requestObj.body = body;
                header.length ? requestObj.header = header : '';
                requestObj.auth = security
                const responseObject = {};
                responseObject.name = `findAll${key}_response`;
                responseObject.originalRequest = {
                    method: 'POST',
                    header: [],
                    url: {
                        raw: requestObj.url,
                    },
                };
                responseObject.status = 'OK';
                responseObject.code = 200;
                responseObject._postman_previewlanguage = 'json';
                const id = fakeData.getObjectId();
                let responseDataForFindAll = _.cloneDeep(data[key]);
                if (!('id' in responseDataForFindAll)) {
                    Object.assign(responseDataForFindAll, { id: id });
                }
                Object.assign(responseDataForFindAll,
                    {
                        createdAt: fakerStatic.date.future(),
                        updatedAt: fakerStatic.date.future(),
                        isDeleted: false,
                        isActive: true
                    });
                if (addDataFormate && addDataFormate[key]) {
                    responseDataForFindAll = await filterResponseBasedOnFormate(addDataFormate[key], responseDataForFindAll);
                }
                if (Object.keys(modelPrivateAttribute).length) {
                    responseDataForFindAll = await removePrivateAttibutesFromResponse(responseDataForFindAll, modelPrivateAttribute)
                }
                const projectionFields = currentPostmanCollectionDetails[api];
                let selectedFields = [];
                if (projectionFields) {
                    selectedFields = projectionFields.fields;
                }
                if (selectedFields && selectedFields.length) {
                    Object.keys(responseDataForFindAll).map(keys => {
                        if (!selectedFields.includes(keys)) {
                            delete responseDataForFindAll[keys];
                        }
                    })
                }
                let findAllObject = {
                    "data": [responseDataForFindAll],
                    "paginator": {
                        "itemCount": 1,
                        "offset": 0,
                        "perPage": 10,
                        "pageCount": 1,
                        "currentPage": 1,
                        "slNo": 1,
                        "hasPrevPage": false,
                        "hasNextPage": false,
                        "prev": null,
                        "next": null
                    }
                }
                let responseJsonData = {
                    "status": "SUCCESS",
                    "message": "Your request is successfully executed",
                    "data": findAllObject
                };
                responseJsonData = JSON.stringify(responseJsonData, undefined, 2)
                responseObject.body = responseJsonData;
                responseObject.header = [
                    { "key": "Content-Type", "value": "application/json" }
                ];
                responseObject.cookie = [];
                requestObj.response = [responseObject];
                platformObj.request.push(requestObj);
            }
            if (api === 'count') {
                requestObj.name = `get${key}Count`;
                requestObj.method = 'POST',
                    header.length ? requestObj.header = header : '';
                requestObj.auth = security
                requestObj.url = platformStr.toLowerCase() !== 'admin' ?
                    `{{url}}/${platformStr.toLowerCase()}/api/v1/${key.toLowerCase()}/count` :
                    `{{url}}/${platformStr.toLowerCase()}/${key.toLowerCase()}/count`;
                body.mode = 'raw';
                body.raw = JSON.stringify({ where: { isActive: true } }, undefined, 2);
                requestObj.body = body;
                const responseObject = {};
                responseObject.name = `get${key}Count_response`;
                responseObject.originalRequest = {
                    method: 'POST',
                    header: [],
                    url: {
                        raw: requestObj.url,
                    },
                };
                responseObject.status = 'OK';
                responseObject.code = 200;
                responseObject._postman_previewlanguage = 'json';
                let responseJsonData = {
                    "status": "SUCCESS",
                    "message": "Your request is successfully executed",
                    "data": {
                        "totalRecords": 10
                    }
                };
                responseJsonData = JSON.stringify(responseJsonData, undefined, 2)
                responseObject.body = responseJsonData;
                responseObject.header = [
                    { "key": "Content-Type", "value": "application/json" }
                ];
                responseObject.cookie = [];
                requestObj.response = [responseObject];
                platformObj.request.push(requestObj);
            }
            if (api === 'findById') {
                requestObj.name = `get${key}`;
                requestObj.method = 'GET',
                    header.length ? requestObj.header = header : '';
                requestObj.auth = security
                requestObj.url = platformStr.toLowerCase() !== 'admin' ?
                    `{{url}}/${platformStr.toLowerCase()}/api/v1/${key.toLowerCase()}/${id}` :
                    `{{url}}/${platformStr.toLowerCase()}/${key.toLowerCase()}/${id}`;
                const responseObject = {};
                responseObject.name = `get${key}_response`;
                responseObject.originalRequest = {
                    method: 'GET',
                    header: [],
                    url: {
                        raw: requestObj.url,
                    },
                };
                responseObject.status = 'OK';
                responseObject.code = 200;
                responseObject._postman_previewlanguage = 'json';
                let responseForGet = _.cloneDeep(data[key]);
                const id_ = fakeData.getObjectId();
                if (!('id' in responseForGet)) {
                    Object.assign(responseForGet, { id: id_ });
                }
                Object.assign(responseForGet,
                    {
                        createdAt: fakerStatic.date.future(),
                        updatedAt: fakerStatic.date.future(),
                        isDeleted: false,
                        isActive: true
                    });
                if (addDataFormate && addDataFormate[key]) {
                    responseForGet = await filterResponseBasedOnFormate(addDataFormate[key], responseForGet);
                }
                if (Object.keys(modelPrivateAttribute).length) {
                    responseForGet = await removePrivateAttibutesFromResponse(responseForGet, modelPrivateAttribute)
                }
                const projectionFields = currentPostmanCollectionDetails[api];
                let selectedFields = [];
                if (projectionFields) {
                    selectedFields = projectionFields.fields;
                }
                if (selectedFields && selectedFields.length) {
                    Object.keys(responseForGet).map(keys => {
                        if (!selectedFields.includes(keys)) {
                            delete responseForGet[keys];
                        }
                    })
                }
                let responseJsonData = {
                    "status": "SUCCESS",
                    "message": "Your request is successfully executed",
                    "data": responseForGet
                };
                responseJsonData = JSON.stringify(responseJsonData, undefined, 2)
                responseObject.body = responseJsonData;
                responseObject.header = [
                    { "key": "Content-Type", "value": "application/json" }
                ];
                responseObject.cookie = [];
                requestObj.response = [responseObject];
                platformObj.request.push(requestObj);
            }
            if (api === 'update') {
                body.mode = 'raw';
                requestObj.name = `update${key}`;
                requestObj.method = 'PUT';
                requestObj.url = platformStr.toLowerCase() !== 'admin' ?
                    `{{url}}/${platformStr.toLowerCase()}/api/v1/${key.toLowerCase()}/update/${id}` :
                    `{{url}}/${platformStr.toLowerCase()}/${key.toLowerCase()}/update/${id}`;
                header.length ? requestObj.header = header : '';
                requestObj.auth = security
                body.raw = JSON.stringify(data[key], undefined, 2);
                requestObj.body = body;
                const responseObject = {};
                responseObject.name = `update${key}_response`;
                responseObject.originalRequest = {
                    method: 'PUT',
                    header: [],
                    url: {
                        raw: requestObj.url,
                    },
                };
                responseObject.status = 'OK';
                responseObject.code = 200;
                responseObject._postman_previewlanguage = 'json';
                let dataForUpdate = _.cloneDeep(data[key]);
                const id1 = fakeData.getObjectId();
                let bodyRawData = dataForUpdate;
                if (!('id' in dataForUpdate)) {
                    Object.assign(dataForUpdate, { id: id1 });
                }
                Object.assign(dataForUpdate,
                    {
                        createdAt: fakerStatic.date.future(),
                        updatedAt: fakerStatic.date.future(),
                        isDeleted: false,
                        isActive: true
                    });
                if (addDataFormate && addDataFormate[key]) {
                    dataForUpdate = await filterResponseBasedOnFormate(addDataFormate[key], dataForUpdate);
                }
                if (Object.keys(modelPrivateAttribute).length) {
                    dataForUpdate = await removePrivateAttibutesFromResponse(dataForUpdate, modelPrivateAttribute)
                }
                const projectionFields = currentPostmanCollectionDetails[api];
                let selectedFields = [];
                if (projectionFields) {
                    selectedFields = projectionFields.fields;
                }
                if (selectedFields && selectedFields.length) {
                    Object.keys(dataForUpdate).map(keys => {
                        if (!selectedFields.includes(keys)) {
                            delete dataForUpdate[keys];
                        }
                    })
                }
                let responseJsonData = {
                    "status": "SUCCESS",
                    "message": "Your request is successfully executed",
                    "data": dataForUpdate
                };
                responseJsonData = JSON.stringify(responseJsonData, undefined, 2)
                responseObject.body = responseJsonData;
                responseObject.header = [
                    { "key": "Content-Type", "value": "application/json" }
                ];
                responseObject.cookie = [];
                requestObj.response = [responseObject];
                platformObj.request.push(requestObj);
            }
            if (api === 'bulkUpdate') {
                requestObj.name = `updateBulk${key}`;
                requestObj.method = 'PUT',
                    header.length ? requestObj.header = header : '';
                requestObj.auth = security
                requestObj.url = platformStr.toLowerCase() !== 'admin' ?
                    `{{url}}/${platformStr.toLowerCase()}/api/v1/${key.toLowerCase()}/updateBulk` :
                    `{{url}}/${platformStr.toLowerCase()}/${key.toLowerCase()}/updateBulk`;
                const objUpdateBulk = {
                    filter: {
                        isActive: true,
                    },
                    data: {
                        isDeleted: false,
                    },
                };
                body.mode = 'raw';
                body.raw = JSON.stringify(objUpdateBulk, undefined, 2);
                requestObj.body = body;
                const responseObject = {};
                responseObject.name = `updateBulk${key}_response`;
                responseObject.originalRequest = {
                    method: 'PUT',
                    header: [],
                    url: {
                        raw: requestObj.url,
                    },
                };
                responseObject.status = 'OK';
                responseObject.code = 200;
                responseObject._postman_previewlanguage = 'json';
                const id = fakeData.getObjectId();
                let bodyRawData = _.cloneDeep(data[key]);
                if (!('id' in bodyRawData)) {
                    Object.assign(bodyRawData, { id: id });
                }
                Object.assign(bodyRawData,
                    {
                        createdAt: fakerStatic.date.future(),
                        updatedAt: fakerStatic.date.future(),
                        isDeleted: false,
                        isActive: true
                    });
                if (addDataFormate && addDataFormate[key]) {
                    bodyRawData = await filterResponseBasedOnFormate(addDataFormate[key], bodyRawData);
                }
                if (Object.keys(modelPrivateAttribute).length) {
                    bodyRawData = await removePrivateAttibutesFromResponse(bodyRawData, modelPrivateAttribute)
                }
                const projectionFields = currentPostmanCollectionDetails[api];
                let selectedFields = [];
                if (projectionFields) {
                    selectedFields = projectionFields.fields;
                }
                if (selectedFields && selectedFields.length) {
                    Object.keys(bodyRawData).map(keys => {
                        if (!selectedFields.includes(keys)) {
                            delete bodyRawData[keys];
                        }
                    })
                }
                let responseJsonData = {
                    "status": "SUCCESS",
                    "message": "Your request is successfully executed",
                    "data": [bodyRawData]
                };
                responseJsonData = JSON.stringify(responseJsonData, undefined, 2)
                responseObject.body = responseJsonData;
                responseObject.header = [
                    { "key": "Content-Type", "value": "application/json" }
                ];
                responseObject.cookie = [];
                requestObj.response = [responseObject];
                platformObj.request.push(requestObj);
            }
            if (api === 'partialUpdate') {
                const pBody = {};
                pBody.isActive = true;
                pBody.isDeleted = false;
                body.mode = 'raw';
                requestObj.name = `partialupdate${key}`;
                requestObj.method = 'PUT';
                requestObj.url = platformStr.toLowerCase() !== 'admin' ?
                    `{{url}}/${platformStr.toLowerCase()}/api/v1/${key.toLowerCase()}/partial-update/${id}` :
                    `{{url}}/${platformStr.toLowerCase()}/${key.toLowerCase()}/partial-update/${id}`;
                header.length ? requestObj.header = header : '';
                requestObj.auth = security
                body.raw = JSON.stringify(pBody, undefined, 2);
                requestObj.body = body;
                const responseObject = {};
                responseObject.name = `partialupdate${key}_response`;
                responseObject.originalRequest = {
                    method: 'PUT',
                    header: [],
                    url: {
                        raw: requestObj.url,
                    },
                };
                responseObject.status = 'OK';
                responseObject.code = 200;
                responseObject._postman_previewlanguage = 'json';
                const id1 = fakeData.getObjectId();
                let bodyRawData = _.cloneDeep(data[key]);
                if (!('id' in bodyRawData)) {
                    Object.assign(bodyRawData, { id: id1 });
                }
                Object.assign(bodyRawData,
                    {
                        createdAt: fakerStatic.date.future(),
                        updatedAt: fakerStatic.date.future(),
                        isDeleted: false,
                        isActive: true
                    });
                if (addDataFormate && addDataFormate[key]) {
                    bodyRawData = await filterResponseBasedOnFormate(addDataFormate[key], bodyRawData);
                }
                if (Object.keys(modelPrivateAttribute).length) {
                    bodyRawData = await removePrivateAttibutesFromResponse(bodyRawData, modelPrivateAttribute)
                }
                const projectionFields = currentPostmanCollectionDetails[api];
                let selectedFields = [];
                if (projectionFields) {
                    selectedFields = projectionFields.fields;
                }
                if (selectedFields && selectedFields.length) {
                    Object.keys(bodyRawData).map(keys => {
                        if (!selectedFields.includes(keys)) {
                            delete bodyRawData[keys];
                        }
                    })
                }
                let responseJsonData = {
                    "status": "SUCCESS",
                    "message": "Your request is successfully executed",
                    "data": bodyRawData
                };
                responseJsonData = JSON.stringify(responseJsonData, undefined, 2)
                responseObject.body = responseJsonData;
                responseObject.header = [
                    { "key": "Content-Type", "value": "application/json" }
                ];
                responseObject.cookie = [];
                requestObj.response = [responseObject];
                platformObj.request.push(requestObj);
            }
            if (api === 'softDelete') {
                requestObj.name = `softDelete${key}`;
                requestObj.method = 'PUT',
                    header.length ? requestObj.header = header : '';
                requestObj.auth = security
                requestObj.url = platformStr.toLowerCase() !== 'admin' ?
                    `{{url}}/${platformStr.toLowerCase()}/api/v1/${key.toLowerCase()}/softDelete/${id}` :
                    `{{url}}/${platformStr.toLowerCase()}/${key.toLowerCase()}/softDelete/${id}`;
                const responseObject = {};
                responseObject.name = `softDelete${key}_response`;
                responseObject.originalRequest = {
                    method: 'PUT',
                    header: [],
                    url: {
                        raw: requestObj.url,
                    },
                };
                responseObject.status = 'OK';
                responseObject.code = 200;
                responseObject._postman_previewlanguage = 'json';

                let responseJsonData = {
                    "status": "SUCCESS",
                    "message": "Your request is successfully executed",
                    "data": {
                        "n": 1,
                        "nModified": 1,
                        "ok": 1
                    }
                };
                responseJsonData = JSON.stringify(responseJsonData, undefined, 2)
                responseObject.body = responseJsonData;
                responseObject.header = [
                    { "key": "Content-Type", "value": "application/json" }
                ];
                responseObject.cookie = [];
                requestObj.response = [responseObject];
                platformObj.request.push(requestObj);
            }
            if (api === 'delete') {
                body.mode = 'raw';
                body.raw = JSON.stringify({ isWarning: true }, undefined, 2);
                requestObj.name = `delete${key}`;
                requestObj.method = 'DELETE',
                    header.length ? requestObj.header = header : '';
                requestObj.auth = security
                requestObj.body = body;
                requestObj.url = platformStr.toLowerCase() !== 'admin' ?
                    `{{url}}/${platformStr.toLowerCase()}/api/v1/${key.toLowerCase()}/delete/${id}` :
                    `{{url}}/${platformStr.toLowerCase()}/${key.toLowerCase()}/delete/${id}`;
                const responseObject = {};
                responseObject.name = `delete${key}_response`;
                responseObject.originalRequest = {
                    method: 'DELETE',
                    header: [],
                    url: {
                        raw: requestObj.url,
                    },
                };
                responseObject.status = 'OK';
                responseObject.code = 200;
                responseObject._postman_previewlanguage = 'json';
                let responseJsonData = {
                    "status": "SUCCESS",
                    "message": "Your request is successfully executed",
                    "data": {
                        "n": 1,
                        "ok": 1,
                        "deletedCount": 1
                    }
                };
                responseJsonData = JSON.stringify(responseJsonData, undefined, 2)
                responseObject.body = responseJsonData;
                responseObject.header = [
                    { "key": "Content-Type", "value": "application/json" }
                ];
                responseObject.cookie = [];
                requestObj.response = [responseObject];
                platformObj.request.push(requestObj);

            }
            if (api === 'deleteMany') {
                body.mode = 'raw';
                body.raw = JSON.stringify({ isWarning: true, ids: [id] }, undefined, 2);
                requestObj.name = `deleteMany${key}`;
                requestObj.method = 'DELETE';
                requestObj.body = body;
                header.length ? requestObj.header = header : '';
                requestObj.auth = security
                requestObj.url = platformStr.toLowerCase() !== 'admin' ?
                    `{{url}}/${platformStr.toLowerCase()}/api/v1/${key.toLowerCase()}/deleteMany` :
                    `{{url}}/${platformStr.toLowerCase()}/${key.toLowerCase()}/deleteMany`;
                const responseObject = {};
                responseObject.name = `deleteMany${key}_response`;
                responseObject.originalRequest = {
                    method: 'DELETE',
                    header: [],
                    url: {
                        raw: requestObj.url,
                    },
                };
                responseObject.status = 'OK';
                responseObject.code = 200;
                responseObject._postman_previewlanguage = 'json';
                let responseJsonData = {
                    "status": "SUCCESS",
                    "message": "Your request is successfully executed",
                    "data": {
                        "n": 2,
                        "ok": 1,
                        "deletedCount": 2
                    }
                };
                responseJsonData = JSON.stringify(responseJsonData, undefined, 2)
                responseObject.body = responseJsonData;
                responseObject.header = [
                    { "key": "Content-Type", "value": "application/json" }
                ];
                responseObject.cookie = [];
                requestObj.response = [responseObject];
                platformObj.request.push(requestObj);
            }
            if (api === 'softDeleteMany') {
                body.mode = 'raw';
                body.raw = JSON.stringify({ ids: [id] }, undefined, 2);
                requestObj.name = `softDeleteMany${key}`;
                requestObj.method = 'PUT';
                requestObj.body = body;
                header.length ? requestObj.header = header : '';
                requestObj.auth = security
                requestObj.url = platformStr.toLowerCase() !== 'admin' ?
                    `{{url}}/${platformStr.toLowerCase()}/api/v1/${key.toLowerCase()}/softDeleteMany` :
                    `{{url}}/${platformStr.toLowerCase()}/${key.toLowerCase()}/softDeleteMany`;
                const responseObject = {};
                responseObject.name = `softDeleteMany${key}_response`;
                responseObject.originalRequest = {
                    method: 'PUT',
                    header: [],
                    url: {
                        raw: requestObj.url,
                    },
                };
                responseObject.status = 'OK';
                responseObject.code = 200;
                responseObject._postman_previewlanguage = 'json';
                let responseJsonData = {
                    "status": "SUCCESS",
                    "message": "Your request is successfully executed",
                    "data": {
                        "n": 2,
                        "nModified": 2,
                        "ok": 1
                    }
                };
                responseJsonData = JSON.stringify(responseJsonData, undefined, 2)
                responseObject.body = responseJsonData;
                responseObject.header = [
                    { "key": "Content-Type", "value": "application/json" }
                ];
                responseObject.cookie = [];
                requestObj.response = [responseObject];
                platformObj.request.push(requestObj);
            }
        }

    }
    if (isAuth && isRole) {
        let requestObj = {};
        let body = {};
        const header = [];
        header.push({
            key: 'Content-Type',
            value: 'application/json',
            description: '',
        });
        let security = {
            "type": "bearer",
            "bearer": {
                "token": "{{token}}"
            }
        }

        body.mode = 'raw';
        requestObj.name = `updateProfile`;
        requestObj.method = 'PUT';
        requestObj.url = platformStr.toLowerCase() !== 'admin' ?
            `{{url}}/${platformStr.toLowerCase()}/api/v1/${key.toLowerCase()}/update-profile` :
            `{{url}}/${platformStr.toLowerCase()}/${key.toLowerCase()}/update-profile`;
        header.length ? requestObj.header = header : '';
        requestObj.auth = security
        body.raw = JSON.stringify(data[key], undefined, 2);
        requestObj.body = body;
        const responseObject = {};
        responseObject.name = `updateProfile${key}_response`;
        responseObject.originalRequest = {
            method: 'PUT',
            header: [],
            url: {
                raw: requestObj.url,
            },
        };
        responseObject.status = 'OK';
        responseObject.code = 200;
        responseObject._postman_previewlanguage = 'json';
        const id1 = fakeData.getObjectId();
        let bodyRawData = _.cloneDeep(data[key]);
        if (!('id' in bodyRawData)) {
            Object.assign(bodyRawData, { id: id1 });
        }
        Object.assign(bodyRawData,
            {
                createdAt: fakerStatic.date.future(),
                updatedAt: fakerStatic.date.future(),
                isDeleted: false,
                isActive: true
            });
        if (addDataFormate && addDataFormate[key]) {
            bodyRawData = await filterResponseBasedOnFormate(addDataFormate[key], bodyRawData);
        }
        if (Object.keys(modelPrivateAttribute).length) {
            bodyRawData = await removePrivateAttibutesFromResponse(bodyRawData, modelPrivateAttribute)
        }
        let responseJsonData = {
            "status": "SUCCESS",
            "message": "Your request is successfully executed",
            "data": [bodyRawData]
        };
        responseJsonData = JSON.stringify(responseJsonData, undefined, 2)
        responseObject.body = responseJsonData;
        responseObject.header = [
            { "key": "Content-Type", "value": "application/json" }
        ];
        responseObject.cookie = [];
        requestObj.response = [responseObject];
        platformObj.request.push(requestObj);
    }

    platformObj = _.cloneDeep(await sortMethods(platformObj));
    return platformObj;
}
async function getPostmanCollectionForFileUpload(platform, fileObject) {
    try {
        let platformObj = {
            name: "File Upload",
            desc: `Upload Files`,
            request: []
        }
        let requestObj = {}
        requestObj = {};
        requestObj.body = {};
        requestObj.body.mode = "formdata"
        requestObj.name = `File upload in ${platform}`
        requestObj.method = "POST"
        if (platform.toLowerCase() != "admin") {
            requestObj.url = `{{url}}/${platform.toLowerCase()}/api/v1/upload`;
        }
        else {
            requestObj.url = `{{url}}/${platform.toLowerCase()}/upload`;
        }
        let formdata = [
            {
                "key": "file[]",
                "type": "file",
                "description": "Select file to upload"
            },
            {
                "key": "file[]",
                "type": "file",
                "disabled": true,
                "description": "Select Another file to upload multiple files"
            },
            {
                "key": "folder",
                "value": "Enter foldername",
                "type": "text",
                "disabled": true,
                "description": "Optional, enable to upload file to specific folder"
            },
            {
                "key": "fileName",
                "value": "Enter fileName",
                "type": "text",
                "disabled": true,
                "description": "Optional, enable to give Specific file name to uploaded File"
            }
        ];
        requestObj.body.formdata = formdata;
        requestObj.header = [];
        requestObj.header.push({
            key: 'Content-Type',
            value: 'multipart/form-data',
            description: '',
        });
        let security = {}
        if (fileObject.authentication) {
            security = {
                "type": "bearer",
                "bearer": {
                    "token": "{{token}}"
                }
            }
        }
        requestObj.auth = security;
        let responseJsonData = {
            "status": "SUCCESS",
            "message": "Your request is successfully executed",
            "data": [
                {
                    "status": true,
                    "path": `path to download file`,
                }
            ]
        };
        responseJsonData = JSON.stringify(responseJsonData, undefined, 2);
        let responseObject = {};
        responseObject.name = `File upload in ${platform}`;
        responseObject.originalRequest = {
            method: 'POST',
            header: [],
            url: {
                raw: requestObj.url,
            },
        };
        responseObject.status = 'OK';
        responseObject.code = 200;
        responseObject._postman_previewlanguage = 'json';
        responseObject.body = responseJsonData;
        responseObject.header = [
            { "key": "Content-Type", "value": "application/json" }
        ];
        responseObject.cookie = [];
        requestObj.response = [responseObject];
        platformObj.request.push(requestObj);

        if (fileObject.storage !== undefined && fileObject.storage.toLowerCase() === 's3_private'){
            //download api for s3 private
            requestObj = {};
            requestObj.body = {};
            requestObj.body.mode = "raw"
            requestObj.name = `Get Presigned Url for S3 private Upload`
            requestObj.method = "POST"
            if (platform.toLowerCase() != "admin") {
                requestObj.url = `{{url}}/${platform.toLowerCase()}/api/v1/generate-pre-signed-url`;
            }
            else {
                requestObj.url = `{{url}}/${platform.toLowerCase()}/generate-pre-signed-url`;
            }
            requestObj.body.raw = JSON.stringify({uri:"s3 URL"},undefined,2);
            requestObj.header = [];
            requestObj.header.push({
                key: 'Content-Type',
                value: 'application/json',
                description: '',
            })
            if (fileObject.authentication) {
                requestObj.header.push({
                    "key": "Authorization",
                    "value": "Bearer {{token}}",
                    "type": "text"
                })
            }
            responseJsonData = {
                "status": "SUCCESS",
                "message": "Your request is successfully executed",
                "data": [
                    {
                        "status": true,
                        "path": `URL to access file`,
                    }
                ]
            };
            responseJsonData = JSON.stringify(responseJsonData, undefined, 2);
            responseObject = {};
            responseObject.name = `Get Presigned Url for S3 private Upload`;
            responseObject.originalRequest = {
                method: 'POST',
                header: [],
                url: {
                    raw: requestObj.url,
                },
            };
            responseObject.status = 'OK';
            responseObject.code = 200;
            responseObject._postman_previewlanguage = 'json';
            responseObject.body = responseJsonData;
            responseObject.header = [
                { "key": "Content-Type", "value": "application/json" }
            ];
            responseObject.cookie = [];
            requestObj.response = [responseObject];
            platformObj.request.push(requestObj);
        }
        
        return platformObj;

    } catch (error) {
        throw new Error(error.message);
    }
}

async function getCollectionForPostman(jsonData, isAuth, userModel, userLoginWith, loginAccessPlatform, userRoles, socialAuth) {
    // "pf" === "platform"

    const port = jsonData?.config?.port;
    let pfNames = jsonData.authentication.platform;
    let pfWiseItems = {}
    let pfWiseItemsArray = []
    let pfWiseCount = {}
    let fieldSelection = {}
    let privateModelData = {};
    if (!_.isEmpty(jsonData["fieldSelection"])) {
        fieldSelection = jsonData["fieldSelection"];
    }
    if (!_.isEmpty(jsonData["modelPrivate"])) {
        privateModelData = jsonData["modelPrivate"];
    }
    for (const pfName of pfNames) {
        pfWiseItems[pfName] = {
            name: null,
            description: null,
            item: []
        }
        pfWiseCount[pfName] = 0
    }

    for (const model in jsonData["models"]) {
        let loginWith = [];
        let values = {};
        if (userModel == model) {
            for (let [k, v] of Object.entries(jsonData["models"][model])) {
                if (k.includes('SSO'.toLowerCase())) {
                    delete jsonData["models"][model][k];
                }
            }
            loginWith = _.keys(_.pickBy(userLoginWith));
            let modelsKeys = _.keys(jsonData["models"][model]);
            if (!modelsKeys.includes(loginWith[0])) {
                jsonData["models"][model][loginWith[0]] = {
                    "type": "String",
                    "unique": true,
                    "uniqueCaseInsensitive": true
                }
            }
        }
        let modelObj = {}
        modelObj[model] = jsonData["models"][model]
        let fakeModel = fakeData.validSchema(_.cloneDeep(modelObj));
        let pfDetails = await getPlatformFromSchemaDynamic(jsonData, jsonData["modelConfig"], model);

        for (const pfName of pfNames) {
            let loginAccessRole = _.keys(loginAccessPlatform);
            pfWiseItems[pfName].name = pfName;
            pfWiseItems[pfName].description = `${pfName} APIs`
            pfWiseCount[pfName]++
            let modelPrivateAttribute = {};
            let format = {};
            if (!_.isEmpty(privateModelData[model])) {
                modelPrivateAttribute = privateModelData[model];
            }
            if (!_.isEmpty(jsonData['authentication']['addDataFormate'])) {
                format = jsonData['authentication']['addDataFormate'];
            }
            if (!_.isEmpty(pfDetails[pfName])) {
                let currentPostmanPlatformDetails = fieldSelection[pfName];
                let currentModelNameDetails = {};
                if (currentPostmanPlatformDetails) {
                    currentModelNameDetails = currentPostmanPlatformDetails[model];
                }
                let modelDetails = await getPostmanCollections(pfName, model, pfDetails[pfName], fakeModel, userModel === model, isAuth, port, currentModelNameDetails, format, jsonData["models"][model], modelPrivateAttribute);
                pfWiseItems[pfName].item.push(modelDetails)
            }

            if (isAuth && userModel === model) {
                let loginDetail = await getPostmanCollectionsForLogin(pfName, userModel, loginWith[0], fakeModel, port, format, jsonData["models"][model], modelPrivateAttribute, model);
                pfWiseItems[pfName].item.push(loginDetail)
            }
            if (pfWiseCount[pfName] == 1 && socialAuth.required) {
                let details = [];
                if (socialAuth.platforms.length) {
                    _.each(socialAuth.platforms, p => {
                        if (p.platforms.includes(pfName)) {
                            details.push(p.type);
                        }
                    });
                }
                if (details.length) {
                    let socialDetails = await getPostmanCollectionForSocialLogin(pfName, details);
                    pfWiseItems[pfName].item.push(socialDetails)
                }
            }
            if (pfWiseCount[pfName] == 1 && !_.isEmpty(jsonData["fileUpload"])) {
                _.each(jsonData["fileUpload"].uploads, async u => {
                    if (u.platform.toLowerCase() == pfName) {
                        let platformObj = await getPostmanCollectionForFileUpload(pfName, u);
                        pfWiseItems[pfName].item.push(platformObj);
                    }
                })
            }

        }

    }
    if (!_.isEmpty(jsonData["routes"]?.apis)) {

        let platformWiseGroup = _.groupBy(jsonData["routes"]?.apis, "platform");
        let customRoutesWithOutPlatform;
        if (platformWiseGroup && platformWiseGroup['undefined']) {
            customRoutesWithOutPlatform = platformWiseGroup['undefined']
            pfWiseItems["Custom Routes"] = {
                name: "Custom Routes",
                description: "Custom Routes",
                item: []
            }
            pfWiseCount["Custom Routes"] = 0
            delete platformWiseGroup['undefined']
        }

        for (let obj in platformWiseGroup) {
            let newPlatform = {
                name: null,
                description: null,
                item: []
            }
            let platformObj = {
                name: `customRoutes`,
                desc: "",
                request: []
            }
            platformWiseGroup[obj].forEach((p, k) => {
                // newPlatform.name = obj.charAt(0).toUpperCase() + obj.slice(1);
                newPlatform.name = obj;
                newPlatform.description = p.descriptions
                let requestObj = {}
                let body = {}
                body.mode = "raw"
                requestObj.name = `${p.api}`
                requestObj.method = `${p.method.toUpperCase()}`
                requestObj.url = `{{url}}${p.api}`
                body.raw = "{}"
                requestObj.body = body;
                platformObj.request.push(requestObj)

            });
            // console.log('pfNames :>> ', pfNames);
            // for(const pfName of pfNames){
            // console.log('obj :>> ', obj);
            if (_.includes(pfNames, obj)) {
                pfWiseItems[obj].item.push(platformObj)
                // console.log('platformObj :>> ', platformObj);
            } else {
                newPlatform.item.push(platformObj);
                if (!pfWiseItems[obj]) {
                    pfWiseItems[obj] = {
                        name: obj,
                        description: `${obj} Apis`,
                        item: []
                    }
                    pfWiseCount[obj] = 0

                }
                pfWiseItems[obj].item.push(newPlatform)
                pfWiseCount[obj] += 1
                // console.log('newPlatform :>> ', newPlatform);
            }
            // }

        }

        if (!_.isEmpty(customRoutesWithOutPlatform)) {
            let newPlatform = {
                name: "routes",
                description: "routes",
                item: []
            }
            let platformObj = {
                name: `customRoutes`,
                desc: "",
                request: []
            }
            customRoutesWithOutPlatform.forEach((p, k) => {
                // newPlatform.name = obj.charAt(0).toUpperCase() + obj.slice(1);
                // newPlatform.name = obj;
                // newPlatform.description = p.descriptions
                let requestObj = {}
                let body = {}
                body.mode = "raw"
                requestObj.name = `${p.api}`
                requestObj.method = `${p.method.toUpperCase()}`
                requestObj.url = `{{url}}${p.api}`
                body.raw = "{}"
                requestObj.body = body; 
                platformObj.request.push(requestObj)
            });
            pfWiseItems["Custom Routes"].item.push(platformObj)
            pfWiseCount["Custom Routes"] += 1
        }

    }

    // for(const pfName of pfNames){
    //     console.log('pfName :>> ', pfName);
    //     console.log('pfWiseItems[pfName].item.length :>> ', pfWiseItems[pfName].item.length);
    // }
    let webNot = [];
    if (!isEmpty(jsonData["modelNotifications"])) {
        Object.values(jsonData.modelNotifications).forEach((keys) => {
            for (const [k, val] of Object.entries(keys)) {
                if (APIS.includes(k) && val.selected) {
                    webNot.push(val.post ? val.post.webNotification === true : val.pre.webNotification === true);
                }
            }
        });
    }



    let fileObj = {};
    if (!_.isEmpty(jsonData["fileUpload"])) {
        for (let i = 0; i < jsonData["fileUpload"].uploads.length; i++) {
            if (!_.isEmpty(jsonData["fileUpload"].uploads[i].platform)) {
                fileObj = jsonData["fileUpload"].uploads[i];
                break;
            }
        }
    }

    let customObj = {
        notification: webNot,
        fileObj,
        port
    }
    let customItems = await setCustomRoutes(customObj);
    if (customItems.item.length) {
        pfWiseItems.common = customItems;
    }

    pfWiseItemsArray = values(pfWiseItems)
    return pfWiseItemsArray
}
async function sortMethods(methods) {
    let post = [], put = [], get = [], del = [];
    for (let i = 0; i < methods.request.length; i++) {
        key = methods.request[i].method;
        if (key == 'PUT') {
            put.push(methods.request[i]);
        }
        else if (key == 'GET') {
            get.push(methods.request[i]);
        }
        else if (key == 'DELETE') {
            del.push(methods.request[i]);
        }
        else {
            post.push(methods.request[i]);
        }
    }

    let returnObj = [
        ...get, ...post, ...put, ...del
    ]
    Object.assign(methods, { request: returnObj })
    return methods;
}

async function generateEnvForPostman(config) {
    let jsonObj = {
        "id": uuid4(),
        "name": `${config.projectName}_environment`,
        "values": [
            {
                "key": "token",
                "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMWRlZDVjMGFjMjAxMmFjMDI4ODkxZiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2MjkzNTEyNzAsImV4cCI6MTYyOTk1MTI3MH0.BJ-WKjNYeFDQ4pn8kfli5gwn6GLz_c3voFht20Agj9k",
                "enabled": true
            },
            {
                "key": "url",
                "value": `http://localhost:${config.port || 3000}`,
                "enabled": true
            }
        ],
        "_postman_variable_scope": "environment",
        "_postman_exported_at": new Date(),
        "_postman_exported_using": "Postman"
    }
    return jsonObj;
}

const getPushNotificationRoutes = (platform, pushNotificationData) => {
    let platformObj = {
        name: "Push Notification",
        desc: `Push Notification Routes`,
        request: []
    }
    let data = {
        userId: '611cbe48fe58009a1603f9f2',
        playerId: 'xxx12345xxx',
        deviceId: '2001abcdef',
        isActive: true,
        isDeleted: false
    }

    let requestObj = {}
    let body = {}
    body.mode = 'raw';
    requestObj = {};
    requestObj.body = {};
    requestObj.name = `Add Player Id`
    requestObj.method = "POST"
    requestObj.url = `{{url}}/${platform.toLowerCase()}/auth/push-notification/addPlayerId`;
    body.raw = JSON.stringify(data, undefined, 2);
    requestObj.body = body;
    requestObj.response = [];
    platformObj.request.push(requestObj);

    requestObj = {}
    body = {}
    data = {
        deviceId: '012345abcde'
    }
    body.mode = 'raw';
    requestObj = {};
    requestObj.body = {};
    requestObj.name = `Remove Player Id`
    requestObj.method = "POST"
    requestObj.url = `{{url}}//${platform.toLowerCase()}/auth/push-notification/removePlayerId`;
    body.raw = JSON.stringify(data, undefined, 2);
    requestObj.body = body;
    requestObj.response = [];
    platformObj.request.push(requestObj);
    return platformObj;
}

async function removePrivateAttibutesFromResponse(fakeModel, privateModelData) {
    let fakeData = _.cloneDeep(fakeModel);
    if (!_.isEmpty(fakeData)) {
        if (!_.isEmpty(privateModelData)) {
            Object.keys(fakeModel).forEach(fm => {
                Object.keys(privateModelData).forEach(pm => {
                    if (fm === pm) {
                        if (Array.isArray(fakeModel[fm])) {
                            //Remove field from array
                            if (fakeModel[fm].length) {
                                let objArray = fakeModel[fm][0];
                                Object.keys(objArray).forEach(obj => {
                                    Object.keys(privateModelData[pm]).forEach(m => {
                                        if (obj === m) {
                                            if (privateModelData[pm][m] === true) {
                                                delete objArray[obj];
                                            }
                                        }
                                    })
                                })
                                fakeData[fm] = [objArray];
                            }
                        } else {
                            if (typeof fakeModel[fm] === 'object' && Object.keys(fakeModel[fm]).length && Object.keys(privateModelData[pm]).length) {
                                //Remove field from object
                                Object.keys(fakeModel[fm]).forEach(d => {
                                    Object.keys(privateModelData[pm]).forEach(m => {
                                        if (m === d) {
                                            if (privateModelData[pm][m] === true) {
                                                delete fakeData[pm][m];
                                            }
                                        }
                                    })
                                })
                            } else {
                                //Remove model property
                                if (privateModelData[pm] === true) {
                                    delete fakeData[pm];
                                }
                            }
                        }
                    }
                })
            });
        }
    }
    return fakeData;
}

async function filterResponseBasedOnFormate(formateArray, data) {
    // let newData={};
    for (let index of formateArray) {
        for (let nestIndex in index) {
            switch (index.dataType) {
                case 'string':
                    if (index[nestIndex] in data) {
                        if (data[index.attribute[0]] && data[index.attribute[1]]) {
                            if (index.operator === 'space') {
                                data[index[nestIndex]] = data[index.attribute[0]].toString().concat(' ', data[index.attribute[1]].toString())
                            } else {
                                data[index[nestIndex]] = data[index.attribute[0]].toString().concat(`${index.operator}`, data[index.attribute[1]].toString())
                            }
                        }
                    }
                    if (!data.hasOwnProperty(index.targetAttr)) {
                        if (index.operator === 'space') {
                            data[index.targetAttr] = data[index.attribute[0]].toString().concat(' ', data[index.attribute[1]].toString())
                        } else {
                            data[index.targetAttr] = data[index.attribute[0]].toString().concat(`${index.operator}`, data[index.attribute[1]].toString())
                        }
                    }
                    break;
                case 'boolean':
                    //  console.log(index.attribute.true);
                    for (let boolIndex in data) {
                        if (typeof data[boolIndex] === 'boolean') {
                            if (data[boolIndex]) {
                                data[boolIndex] = index.attribute.true;
                            } else {
                                data[boolIndex] = index.attribute.false;
                            }

                        }
                    }
                    break;

                case 'date':
                    for (let dateIndex in data) {
                        if (data[dateIndex] instanceof (Date)) {
                            data[dateIndex] = dayjs(data[dateIndex]).format(index.attribute);
                        }
                    }
                    break;
            }
        }
    }
    return data;
}
module.exports = {
    getCollectionForPostman,
    generateEnvForPostman
};


