#!/bin/sh

echo "----------------"
echo "ENTRYPOINT START"
echo "----------------"
echo ""

digo_supported_lang="vi en"
for lang in $digo_supported_lang; do

  index_file="./${lang}/index.html"
  index_bak_file="./${lang}/index.html.bak"
  config_file="./${lang}/assets/app.config.json"
  config_bak_file="./${lang}/assets/app.config.json.bak"
  exists_bak_file=1

done

nginx -g "daemon off;"
