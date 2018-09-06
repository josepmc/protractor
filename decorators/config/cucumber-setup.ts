import { After, HookScenarioResult, World, Status, setDefaultTimeout, Before } from 'cucumber';
import { oh, WindowInfo, By } from 'framework/helpers';
const debugMode = process.env.IS_DEBUG;

process.on('uncaughtException', function (err) {
    console.error((err && err.stack) ? err.stack : err);
    debugger;
});

// For process.exit file removal, when having a lot of files
require('events').EventEmitter.defaultMaxListeners = 100;

setDefaultTimeout(debugMode ? 60 * 60 * 1000 : 5 * 60 * 1000);

// TODO: Build nice reporting

let find = function (en: Object, name: string): string {
    for (let key of Object.keys(en)) if (isNaN(key as any) && key.toLowerCase().startsWith(name)) return key;
    return null;
}

let first = true;
Before({ timeout: debugMode ? 60 * 60 * 1000 : 5 * 60 * 1000 }, async function (this: World, scenario: HookScenarioResult) {
    console.log('DEBUG: Closing extra windows');
    let def = await oh.browser.defaultFrame(true);
    let all = await oh.browser.getAllWindowHandles();
    let handles = all.filter(h => def.windowHandle != h);
    if (all.length == handles.length) handles = handles.splice(0, 1);
    for (let h of handles) {
        try {
            await oh.browser.switchToFrame(new WindowInfo(h, [null]));
            await oh.browser.window().close();
        } catch (error) {
            debugger;
        }
    }
});

After(async function (this: World, scenario: HookScenarioResult) {
    let world = this;
    const report = async function () {
        switch (process.env.FAIL_LOG) {
            default:
            case 'image':
                let base64 = await oh.browser.takeScreenshot();
                await world.attach(base64, 'image/png');
            case 'html':
                console.log(await oh.browser.getPageSource());
        }
    }
    if (scenario.result.status === Status.FAILED) {
        // Take screenshot and attach it to the test
        try {
            console.log('DEBUG: Logging main page...');
            await report();
            let def = await oh.browser.currentFrame();
            let all = await oh.browser.getAllWindowHandles();
            let handles = all.filter(h => def.windowHandle != h);
            if (all.length == handles.length) handles = handles.splice(0, 1);
            for (let i = 0; i < handles.length; ++i) {
                console.log(`DEBUG: Logging page ${i} of ${handles.length + 1}...`);
                try {
                    await oh.browser.switchToFrame(new WindowInfo(handles[i], [null]));
                    await report();
                } catch (error) {
                    console.log(`Error attach: Can't take secondary screenshot. Error: ${JSON.stringify(error)})`)
                }
            }
        }
        catch (error) {
            console.error(`Error attach: Can't take screenshot. Error: ${JSON.stringify(error)})`);
        }
    }
    // If we restart here we risk a node instakill
});

