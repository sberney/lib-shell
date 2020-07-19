#!/bin/bash

echo "Press enter to continue"
while [ true ]
do
  read -t 3 -n 1
  if [ $? = 0 ]
  then
    echo "received keypress. exited.";
    exit 0
  else
    echo "waiting for enter keypress"
  fi
done
