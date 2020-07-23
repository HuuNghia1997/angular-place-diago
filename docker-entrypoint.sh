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

  if [ -n "${KEYCLOAK_URL}" ]; then
    replace='\/'
    encodedValue=${KEYCLOAK_URL//\//$replace}
    sed -e "s/\"url\": \"\${KEYCLOAK_URL}\"/\"url\": \"$encodedValue\"/g" -i $config_file
  fi

  if [ -n "${KEYCLOAK_REALM}" ]; then
    sed -e "s/\"realm\": \"\${KEYCLOAK_REALM}\"/\"realm\": \"${KEYCLOAK_REALM}\"/g" -i $config_file
  fi

  if [ -n "${OAUTH2_CLIENT_ID}" ]; then
    sed -e "s/\"clientId\": \"\${OAUTH2_CLIENT_ID}\"/\"clientId\": \"${OAUTH2_CLIENT_ID}\"/g" -i $config_file
  fi

  if [ -n "${DIGO_API_GATEWAY}" ]; then
    replace='\/'
    encodedValue=${DIGO_API_GATEWAY//\//$replace}
    sed -e "s/\"rootUrl\": \"\${DIGO_API_GATEWAY}\"/\"rootUrl\": \"$encodedValue\"/g" -i $config_file
  fi
  if [ -n "${DIGO_TYPE_FILE}" ]; then
      sed -e "s/\"realm\": \"\${DIGO_TYPE_FILE}\"/\"realm\": \"${DIGO_TYPE_FILE}\"/g" -i $config_file
  fi
  if [ -n "${DIGO_TYPE_PROCESS}" ]; then
      sed -e "s/\"realm\": \"\${DIGO_TYPE_FILE}\"/\"realm\": \"${DIGO_TYPE_PROCESS}\"/g" -i $config_file
  fi
  if [ -n "${DIGO_TYPE_PROCESS_ID}" ]; then
      sed -e "s/\"realm\": \"\${DIGO_TYPE_FILE}\"/\"realm\": \"${DIGO_TYPE_PROCESS_ID}\"/g" -i $config_file
  fi

#shell script in linux


done

nginx -g "daemon off;"
