import { WebdriverBy } from 'lib/locators';

export const LocatorCompare = (first: WebdriverBy, second: WebdriverBy): boolean => {
    return (first === null && second === null)
        || (first !== null && second != null && first.toString() === second.toString());
};
