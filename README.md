# Hubspot Development Workflow

This repository contains local development workflow with custom modules and templates. Allows you to develop modules and templates locally, and then upload them to Hubspot CMS using Circle CI.

## Overview

### Directory structure

```
.circleci
  |_
     config.yml - CI config
     deployModules.js - modules deploy script
     deployAssets.js - assets deploy script
dist - directory created at production build
distAssets - directory created at production build
dev - contains local-cms-server from hubspot
  |_
    context - site data
    designs - modules, templates, etc. - generated automatically with gulp
src -
  |_ 
     assets - assets: images, etc.
     modules - modules
     scss - global scss styles to import. Like variables, fonts, etc.
     templates - page templates
     global.scss - global styles
templates - directory contains templates for new modules and templates. Do not change!
  |_
     module
     template.html
```

### Development server

See https://github.com/HubSpot/local-cms-server-cli/ for reference.

### Custom modules

See https://github.com/bradhave94/HubSpot/wiki/Custom-Modules-JSON for reference

## Setup

Clone this repo and set origin to yours or download as zip and init your new repo.

If you want to easily merge an update to your clone:

```git remote add upstream git@github.com:macap/hubspot-workflow.git`` 

adds this repo as a remote. And then to merge an update to your current branch:

```
git fetch upstream
git merge (--squash) upstream/master
(git commmit hubspot workflow update)
```

Commands in brackets are optional, use them if you also want to squash merged commit to keep your history nice and clean.


### Setup development build environment

If you don't have *Gulp CLI* installed globally install it first with `npm install --global gulp-cli`

Then install required packages in project main directory:

```
  yarn
```

### Setup development server

Development server requires *Docker* installed and running. If you don't have docker yet, you can get it from [Docker Download page](https://www.docker.com/products/docker-desktop)

```
  cd dev
  yarn
  yarn hs-cms-server init --context
```

## Usage


### Starting development build server

```gulp build && gulp watch```

### Starting development server

`cd dev && yarn hs-cms-server start`


## Development

### Creating a template

Empty template file should be created in Hubspot web interface first (see known issues). Template must include required hs tags:

```{{ standard_header_includes }}```

```{{ standard_footer_includes }}```

You can use template generator:

```gulp template.new --name template-name```

### Creating a module

You can use module generator:

```gulp module.new --name module-name```

Modules use scss by default.

### Inserting a module into a template

```{% module "module_123" path="/modules/module_dir" %}```

Where *module_123* is unique module identifier (should be random for each include), and path is path to module directory without `.module` extension (if your module is in `src/modules` just replace `module_dir` with your module name).

### Assets

Assets should be placed in `src/assets` directory, and called with `/assets` path.
So if you want to display `image.png` placed in `src/assets` directory you should do:

```<img src="/assets/image.png">```

assets will be uploaded to hubfs and proper path (hubspot cdn) will be providen on build.

### Global style

If you want to include `global.scss` contents into template:

```{{ require_css("/assets/global.css") }}```

### Working with data from Hubspot (pages, posts, hubdb)

- TBD

## Deployment

Deployment config is in .circleci catalog. Files are build in CI environment and then uploaded to Hubspot via FTP.

Required ENV variables in circleci:

```
FTPUSERNAME=
FTPPASS=
FTPHOST=
MODULES_DEST=/portals/<<portal name>>/content/designs/
ASSETS_DEST=/portals/<<portal name >>/content/files/assets/
PORTALID=
```

where `MODULES_DEST` is destination catalog in hubspot.


## Known issues

- Template must be created in Hubspot web interface before pushing it via ftp
- Local hubl server sometimes hungs up - restart needed

## Disclaimer

- TBD

## TODO

- [ ] Deploy script improvements (upload only changed files, delete old ones?)
- [ ] Data from hubspot readme section