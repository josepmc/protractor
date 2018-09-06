import { AbstractPage } from "framework/object/abstract";
import { Locator, By, oh, TestConfig } from "framework/helpers";
import { GoogleSearch } from "./search";
import { injectable } from "framework/object/core/iConstructor";
import { inputField } from "framework/object/core/decorators";
import { GoogleSearchModel } from "models/googleSearch";

@injectable export class GooglePage extends AbstractPage implements GoogleSearchModel {
    public featureSelector: Locator = By.xpath('.//*[@id="searchform"]');
    constructor() {
        super(TestConfig.instance.protractorConfig.baseUrl);
    }
    @inputField<string>(By.xpath('.//*[@id="lst-ib"]')) public search: string;
    public async next(lookForNext: boolean = true): Promise<GoogleSearch> {
        await oh.type(By.xpath('.//*[@id="lst-ib"]'), oh.key.ESCAPE);
        await oh.click(By.xpath('.//*[@name="btnK"]'), this.element);
        return lookForNext && GoogleSearch.WaitForPage<GoogleSearch>(GoogleSearch);
    }
}