# Chicago Crimes

## Project Goal

Explore public Chicago crimes data set using the latest Python open source libs for big data visualizations: Dask, HoloViews, Datashader, GeoViews, Bokeh.

# Project Build Instructions

## 1. Python Environment Setup

### - Download and install Anaconda: https://www.continuum.io/downloads

### - Install some data sci Python libs for data analytics from conda-forge:

```bash
conda install -c conda-forge fastparquet snappy python-snappy pyspark
    bokeh dask distributed numba scikit-learn pyarrow matplotlib palettable
    seaborn bottleneck pymc3 brewer2mpl holoviews datashader
```

### - Archive your Anaconda dev environment:

The following command will create a spec file with a list of packages installed: 

```bash
conda list --explicit > spec-file.txt
```

See conda.io for more info on managing environments: https://conda.io/docs/using/envs.html


## 2. Download raw CSV Chicago crimes data (~1.5Gb)

Click on Download > CSV menu in the top right corner to download all crimes data since 2001:

https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-present/ijzp-q8t2

## 3. Convert raw CSV data to DataFrame with Dask and Distributed

 Convert raw CSV data to pandas DataFrame and save it in Parquet file format for some preliminary data scrubbing and analytics with Jupyter notebooks

TODO:
```bash
python scripts/convert_crime_csv_to_parquet.py
```

## 4. Run interactive Jupyter Notebooks from /notebooks to sample data

```bash
jupyter notebook
```
...

See: https://github.com/RandomFractals/ChicagoCrimes/blob/master/notebooks/csv_data_preview.ipynb


# References

Helpfull data and tech arcticles used for this project.

## Chicago Crimes Data Portals

- City of Chicago crime data portal:

https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-present/ijzp-q8t2

- Chicago Tribune homicides portal and crime data FAQ:

http://crime.chicagotribune.com/chicago/homicides

http://crime.chicagotribune.com/chicago/faq

- Public Google BigQuery Chicago crime data: 

https://cloud.google.com/bigquery/public-data/chicago-crime-data


## Chicago Crimes Data Narratives

Joe Leider put together a number of Tableau data narratives on crime in Chicago from 2001 to 2015 (must read):

http://joeleider.com/data-visualization/13-data-narratives-on-crime-in-chicago/

http://joeleider.com/data-visualization/the-seasonality-of-chicago-crime/

http://joeleider.com/data-visualization/visualizing-crime-by-hour-in-chicago/

- Chicago homocides and arrests from 2001 to February 2017:

http://joeleider.com/data-visualization/murder-in-chicago-finding-the-ferguson-effect-in-10-graphs/


## Python Data Science Links

Ubuntu 16.04 LTS Python, R, Spark, Docker setup instructions:

https://r-shekhar.github.io/posts/data-science-environment.html
