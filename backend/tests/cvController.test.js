import test from 'node:test';
import assert from 'node:assert/strict';
import { cvController } from '../controllers/cvController.js';
import { CVModel } from '../models/CVModel.js';

test('createCV stores provided content when it is sent in the request body', async () => {
  const originalCreate = CVModel.create;
  let captured = null;

  CVModel.create = async (userId, templateId, content) => {
    captured = { userId, templateId, content };
    return { id: 99 };
  };

  const req = {
    userId: 7,
    body: {
      templateId: 'henry_simple',
      content: {
        fullName: 'Test User',
        title: 'QA Engineer',
        summary: 'Saved from regression test'
      }
    }
  };

  const res = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    }
  };

  await cvController.createCV(req, res);

  assert.equal(captured.userId, 7);
  assert.equal(captured.templateId, 'henry_simple');
  assert.equal(captured.content.fullName, 'Test User');
  assert.equal(captured.content.title, 'QA Engineer');
  assert.equal(captured.content.summary, 'Saved from regression test');
  assert.equal(res.payload.success, true);
  assert.equal(res.statusCode, 201);

  CVModel.create = originalCreate;
});
