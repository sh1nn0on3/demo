const scrapeCategory = (browser, url) =>
  new Promise(async (res, rej) => {
    try {
      let page = await browser.newPage();
      console.log(">> Mo tab moi ...");
      await page.goto(url);
      console.log(">> Truy cap vao" + url);
      // await page.waitForSeletor("")
      console.log(">> website da load xong ...");

      const dataCategory = await page.$$eval(
        "body > div.header > div.header-bottom > div > div > div.header-menu > div.menu_holder > div",
        (els) => {
          dataCategory = els.map((el) => {
            return {
              category: el.querySelector("p").innerText,
              link: el.querySelector("a").href,
            };
          });
          return dataCategory;
        }
      );
      await page.close();
      res(dataCategory);
    } catch (error) {
      console.log("loi o scraper");
    }
  });

const scrapeItems = (browser, link) =>
  new Promise(async (res, rej) => {
    try {
      let newPage = await browser.newPage();
      console.log(">> da mo tab moi ...");
      await newPage.goto(link);
      console.log(">> da truy cap vao link " + link);
      // await page.waitForSelector(".product-category");
      console.log(">> website da load xog...");

      // url sản phẩm
      const detailsLinks = await newPage.$$eval(
        " div.product-category > div > div.product-list.d-flex.flex-wrap > div > div.product-img",
        (els) => {
          detailsLinks = els.map((el) => {
            return el.querySelector("a").href;
          });
          return detailsLinks;
        }
      );
      // scrapeData.header = detailsLinks;
      // -----------------------
      const scraperDetail = (link) => {
        new Promise(async (res, rej) => {
          try {
            console.log("3");
            let pageDetail = await browser.newPage();
            console.log(">> Đã mở tab mới ...");
            await pageDetail.goto(link);
            console.log(">> Đã truy cập vào trang " + link);
            // await pageDetail.waitForSelector("");
            console.log(">> Đã load xong tag main ...");

            console.log("4");
          
            // cạo image
            const images = await pageDetail?.$eval("#product-big > a ", (el) => {
              return el.querySelector("img")?.src;
            });
            // detail
            const cpu = await pageDetail.$eval("#attr-cpu > ul > li", (el) => {
              return el.querySelector("span").innerText;
            });
            const ram = await pageDetail.$eval("#attr-ram > ul > li", (el) => {
              return el.querySelector("span").innerText;
            });
            const ssd = await pageDetail?.$eval("#attr-o-cung > ul > li", (el) => {
              return el.querySelector("span")?.innerText;
            });
            const card = await pageDetail?.$eval("#attr-card-do-hoa > ul > li", (el) => {
              return el.querySelector("span")?.innerText;
            });
            const man = await pageDetail.$eval("#attr-man-hinh > ul > li", (el) => {
              return el.querySelector("span").innerText;
            });
            //
            const detailData = {};
            detailData.images = images;
            detailData.cpu = cpu;
            detailData.ram = ram;
            detailData.ssd = ssd;
            detailData.card = card;
            detailData. man = man;
            //
            await pageDetail.close();
            res(detailData)
          } catch (error) {
            console.log("lỗi ở scraper" + error);
          }
        });
      };
      // ------------------
      const details = [];
      for (let link of detailsLinks) {
        const detail = scraperDetail(link);
        details.push(detail);
      }
      scrapeData.body = details;

      //-------------------

      res(scrapeData);
    } catch (error) {
      console.log("lỗi ở scraper");
      rej(error);
    }
  });

module.exports = { scrapeCategory, scrapeItems };
