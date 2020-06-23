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

if [ ! -f $config_bak_file ]; then
    echo "> copy $config_file to $config_bak_file";
    cp $config_file $config_bak_file
    echo "> copy $index_file to $index_bak_file";
    cp $index_file $index_bak_file
    exists_bak_file=0
  fi

  if [ $exists_bak_file -eq 1 ]; then
    echo "> copy $config_bak_file to $config_file";
    cp $config_bak_file $config_file;
    echo "> copy $index_bak_file to $index_file";
    cp $index_bak_file $index_file;
  fi

done

nginx -g "daemon off;"
