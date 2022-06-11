/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const TheCommand = require('../src/BaseCommand')

jest.mock('inquirer')
const inquirer = require('inquirer')
const mockExtensionPrompt = jest.fn()
inquirer.createPromptModule = jest.fn().mockReturnValue(mockExtensionPrompt)

beforeEach(() => {
  inquirer.createPromptModule.mockClear()
  mockExtensionPrompt.mockReset()
})

test('init', async () => {
  const cmd = new TheCommand([])
  cmd.config = {}
  await cmd.init()
  expect(cmd.prompt).toBe(mockExtensionPrompt)
  expect(inquirer.createPromptModule).toHaveBeenCalledWith({ output: process.stderr })
})

test('catch', async () => {
  const cmd = new TheCommand([])
  cmd.error = jest.fn()
  await cmd.catch(new Error('fake error'))
  expect(cmd.error).toHaveBeenCalledWith('fake error')
})

test('will change error message when aio templates outside of the application root', async () => {
  const cmd = new TheCommand([])
  cmd.error = jest.fn()
  await cmd.catch(new Error('ENOENT: no such file or directory, open \'package.json\''))

  const errorList = [
    'Not a valid application root folder.',
    'Please run \'aio templates\' commands from a folder generated by aio app init',
    'ENOENT: no such file or directory, open \'package.json\''
  ]
  expect(cmd.error).toHaveBeenCalledWith(errorList.join('\n'))
})
