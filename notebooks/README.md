# Chicago Crimes Notebooks

This repository contains a number of notebooks for exploring Chicago crimes since 2001 to present (August 2017).

## csv-data-preview.ipynb

CSV data preview notebook contains raw CSV data preview code for 2017 Chicago crime data,
such as number of reported crimes, number of arrests and domestic crime reports,
unique column value counts, etc. to get a feel for the crime data structure 
and potential insights that can be harvested from it.

CSV data in this notebook is loaded with dask. More info on Dask framework here:

http://dask.pydata.org/en/latest/

Dask is just like pandas (most commonly used data munging framework in Python), 
but more suited to working with large distributed data sets.

## crime-plots.ipynb

Crimes plots notebook contains matplotlib charts for 2017 Chicago crime data.

## all-chicago-crime-charts.ipynb

This notebook loads large Chicago crimes dataset (~1.4Gb of raw data, ~219Mb compressed) 
with all crimes data recorded since 2001 to present (August 2017).

A variety of matplotlib charts in this notebook show decline of Chicago crime over time,
as well as some crime location data for futher insights.

## interactive-chicago-crime-charts.ipynb

Per description this notebook will contain interactive Bokeh plots 
that will be packaged and deployed to heroku most likely 
for public Chicago crimes data visualizations preview.

This part is currently in dev with an ETA of live data viz in September, 2017.

# This is Not Yet Another Chicago Crimes Story Telling Journal

This collection of notebooks on Chicago crime was put together strictly
for code and data visualization demo purpose with dask 
and open source Python charting libraries.

Therefore, these notebooks do not contain the usual commentary on visualized
data insights interleaved with code and charts to avoid introducing any bias 
in this short exploratory data analysis (EDA) study. 

Many factors affect metropolitan area crimes, including weather, 
employment, education and poverty levels, racial mix too, that I plan to explore later,
federal government policy changes over time, local government changes, etc.

I simply wanted to put together a set of notebooks that depict 
public Chicago crime data over time, and slice and dice it across 
different data dimensions for display.

You can certainly draw some conclusions from them on your own, 
depending on your area of interest in this massive crime data set.

# Introduction to Bokeh

Flip through these tutorial notebooks for a good intro to Bokeh:

http://nbviewer.jupyter.org/github/bokeh/bokeh-notebooks/blob/master/tutorial/00%20-%20intro.ipynb
