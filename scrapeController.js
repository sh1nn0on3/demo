const scrapers = require("./scraper");
const fs = require("fs");

const scraperController = async (browserInstance) => {
  const url = "https://laptop88.vn/";
  const indexs = [0, 1];
  try {
    let browser = await browserInstance;
    // goi ham cao o file scrape
    const categories = await scrapers.scrapeCategory(browser, url);
    // console.log(categories);
    const selecetedCategories = await categories.filter((category, index) =>
      indexs.some((i) => i === index)
    );
    // cao tung phan con
    const links = await scrapers.scrapeItems(
      browser,
      selecetedCategories[0].link
    );
    // console.log("🚀 ~ file: scrapeController.js:20 ~ scraperController ~ links:", links)

    // ------- đọc ra file dùng fs ------------
    fs.writeFile("data.json", JSON.stringify(links), (err) => {
      if (err) console.log("lỗi err" + err);
      console.log("thêm data thành công");
    });

    await browser.close();
  } catch (error) {
    console.log("loi scrapeController " + error);
  }
};

module.exports = scraperController;
