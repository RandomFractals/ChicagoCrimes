# Chicago Crimes

## Project Goals

Explore seasonality of Chicago crimes using public Chicago crime data sets.

## Python Environment Setup

### 1. Download and install Anaconda: https://www.continuum.io/downloads

### 2. Install some data sci Python libs for data analytics from conda-forge:

`conda install -c conda-forge fastparquet snappy python-snappy\
    bokeh dask distributed numba scikit-learn pyarrow matplotlib palettable\
    seaborn bottleneck pymc3 brewer2mpl`

### 3. Archive your Anaconda dev environment:

The following command will produce a list of packages installed in the Anaconda environment. 

`conda list --explicit > spec-file.txt`

See conda.io for more info on managing environments: https://conda.io/docs/using/envs.html


...

## References

- City of Chicago crime data portal:

https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-present/ijzp-q8t2

- Chicago Tribute homicides portal and crime data FAQ:

http://crime.chicagotribune.com/chicago/homicides

http://crime.chicagotribune.com/chicago/faq

- Public Google BigQuery Chicago crime data: 

https://cloud.google.com/bigquery/public-data/chicago-crime-data
