# NMLE

**Node Modules License Exporter** is a commandline tool to export licenses of node modules quickly and relieably.

## Usage:

`node . --path <path to project root; can take multiple paths seperated by ;>`

Optional parameters:
```
--out <path to output file>   # if none defined will print to console

--exporter <name>   # which expoter to use. By default there are 'markdown' and 'json' however additional ones can be added in the /exporter directory.

--exclude <fileprefixes, if multiple seperated by ;>   # will not export modules starting with that prefix. Best used to exclude whole npm scopes like for instance @types

-d --noDependencies   # will only take packages that are defined in the project's package.json

-u --noDuplicates   # will not export the same module twice
```
