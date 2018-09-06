import { AbstractPage } from "framework/object/abstract";
import { injectable, inject } from "framework/object/core/iConstructor";
import { Locator, By } from "framework/helpers";
import { SearchResult } from "objects/features/result";

@injectable export class GoogleSearch extends AbstractPage {
    public featureSelector: Locator = By.xpath('.//*[@id="rcnt"]');
    @inject(SearchResult, { multiInstance: true }) public results: SearchResult[];
}