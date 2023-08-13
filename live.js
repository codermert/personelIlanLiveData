const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://kamuilan.sbb.gov.tr/';

axios.get(baseUrl, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
  }
})
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    const ilanlar = [];

    $('#nav2 > li').each((index, element) => {
      const timeElement = $(element).find('.cbp_tmtime');
      const labelElement = $(element).find('.cbp_tmlabel');

      const date = timeElement.find('h4').text() + " " + timeElement.find('h3').text();
      
      labelElement.find('a').each((aIndex, aElement) => {
        const a = $(aElement);
        const logoPath = a.find('.limg2').attr('src');
        const logoUrl = baseUrl + logoPath;
        const title = a.find('.alt_p1').text();
        const description = a.find('.alt_p2').text();

        ilanlar.push({
          tarih: date,
          logo: logoUrl,
          baslik: title,
          aciklama: description
        });
      });
    });

    const jsonData = JSON.stringify(ilanlar, null, 2);

    fs.writeFile('ilanlar.json', jsonData, 'utf8', (err) => {
      if (err) {
        console.error('Dosya kaydedilirken bir hata oluştu:', err);
      } else {
        console.log('Veriler "ilanlar.json" dosyasına kaydedildi.');
      }
    });
  })
  .catch(error => {
    console.error('Hata:', error);
  });
