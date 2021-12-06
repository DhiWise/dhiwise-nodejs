/* eslint-disable no-undef */
const request = require('supertest');

process.env.NODE_ENV = 'test';
const app = require('../app');

jest.setTimeout(50000);

test('should create a new application and generate a project with default setting', async () => {
  const createdApp = await request(app)
    .post('/web/v1/application/create')
    .send({
      name: 'App1',
      configInput: {
        port: '5000',
        databaseName: 'node_demo',
        isAuthentication: true,
      },
      stepInput: {
        ormType: 1,
        databaseType: 1,
      },
      authModel: 1,
      projectId: null,
      definitionId: null,
      projectDefinitionCode: 'NODE_EXPRESS',
    });
  expect(createdApp.headers['content-type']).toEqual('application/json; charset=utf-8');
  expect(createdApp.statusCode).toBe(200);
  expect(createdApp.body.status).toBe(200);
  const generatedApp = await request(app)
    .post('/web/v1/application/generate')
    .send({
      applicationId: createdApp.body.data._id,
      projectType: 'MVC',
    });
  expect(generatedApp.statusCode).toBe(200);
  expect(generatedApp.body.status).toBe(200);
});
