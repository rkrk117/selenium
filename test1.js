const {Builder, By, Key, until} = require('selenium-webdriver');
const fs = require("fs");
let requiredVal = Number(fs.readFileSync("required_value.txt", "utf8"));


(async function test() {
    let driver = await new Builder().forBrowser('firefox').build();
    try {
        await driver.get("https://yandex.ru/maps/54/yekaterinburg/");
        await driver.findElement(By.className("traffic-control__icon-text")).click();
        let traffic = await driver.wait(until.elementLocated(By.css(".traffic-control__icon-text")), 10000);
        await driver.wait(until.elementTextMatches(traffic, /\d/), 10000);
        let trafficVal = await traffic.getText();
        let result = Math.abs(trafficVal - requiredVal) <= 1 ? "passed" : "failed";
        console.log(result);
        let time = new Date();
        fs.appendFileSync("test.log", time + " expected:" + requiredVal + ", got:" + trafficVal + " " + result + "\n");
        driver.takeScreenshot().then(function(data){
            var base64Data = data.replace(/^data:image\/png;base64,/,"")
            fs.writeFile(time.toDateString() + " " + time.getHours() + "-" + time.getMinutes() + "-" + time.getSeconds() + ".png", base64Data, 'base64', function(err) {
                if(err) console.log(err);
            });
        }, error => {
            console.log("Cant take a scrteenshot");
        });
    } finally {
        await driver.quit();
    }
})();