# Markdown Links

## Índice

* [1. Introducción](#1-Introducción)
* [2. Instalación](#2-Instalación)
* [3. Interfaz de linea de comandos](#3-Interfaz-de-linea-de-comandos)
* [4. Adicionales](#4-Adicionales)


***

## 1. Introducción

En la actulidad [Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado ligero muy popular entre desarrolladores. Es usado en muchísimas plataformas que manejan texto plano (GitHub, foros, blogs, ...), y es muy común encontrar varios archivos en ese formato en cualquier tipo de repositorio.

Estos archivos normalmente contienen _links_ (vínculos/ligas) que
muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de la información que se quiere compartir.

Por consiguiente, esta librería pretende proporcionar a los desarrolladores una herramienta que les permita leer todos los archivos en formato `Markdown` dentro de un repositorio y a extraer estadistícas en tiempo real sobre el estado de conectividad de los links.

Los desarrolladores podrán verificar si los links se repiten dentro de un respoitorio, si se encuentran activos o si por el contrario, se han roto. 

## 2. Instalación 

Ejecuta en consola el siguiente comando

```sh
npm i md-links vivipe28
```

## 3. Interfaz de línea de comandos

Para poder acceder a los links dentro de una ruta específica, ejecuta en consola el siguiente comando:

```sh
 md-links ./some/example.md

href: http://google.com/,
text: google,
fileMd: ./some/example.md
```

Si deseas verificar el estado de validación de los links de la ruta de interés, ejecuta en consola

```sh
md-links ./some/example.md --validate

href: http://google.com/,
text: google,
fileMd: ./some/example.md,
status: 200
response: OK
```
Ahora bien, podrás visualizar estadísticas simples a través del siguiente comando:

```sh
md-links ./some/example.md --stats

Total: 3
Unique: 3
```
Y finalmente, si ejecutas el siguiente comando podrás ver las estadísticas de validación:

```sh
md-links ./some/example.md --stats --validate
Total: 3
Unique: 3
Broken: 1
```

## 4. Adicionales

Si deseas acceder al flujograma del proyecto, haz click [aquí](https://www.figma.com/file/xevpzrXsJkJjaowomgZqw2/md-links?node-id=0%3A1).