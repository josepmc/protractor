import 'reflect-metadata';
export { TestConfig } from './testConfig';
export { Config as RunnerConfig } from 'lib';
import { By as WebdriverBy } from 'selenium-webdriver';
import { ProtractorBy, helperBrowsers } from 'lib';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
export let expect = chai.expect;
export let assert = chai.assert;
export let should = chai.should;
import { ObjectHelper } from './objectHelper';
import { ByWrapper } from './object/wrapper/browser';
export { LocatorCompare } from './object/shared';
export { NumberRange } from './object/interfaces';
export { ElementWrapper, WindowInfo } from './object/wrapper';
export let oh = new ObjectHelper(helperBrowsers);
export type Locator = WebdriverBy;
export const Locator = WebdriverBy;
export let By: ByWrapper = oh.By;
export let by: ByWrapper = By;
