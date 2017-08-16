# coding: utf-8
import numpy as np
import pandas as pd
import dask.dataframe as dd
from datetime import datetime

def print_line():
    print('------------------------------------------------------------')    
    
# load csv data into dask df
# Note: change this to parse smaller ~35Mb 2017 crime data file
data_file_name = '../raw_data/Crimes_-_2001_to_present.csv' #'../raw_data/Crimes_-_2017.csv'

print('{}: Loading data file (~48min): {} ...'\
	.format(datetime.now().strftime('%H:%M:%S'), data_file_name))
print('\tThis might take an hour on a quad core with 4Gb of ram to spare.')
print('\tRun it before you step out for lunch :)\n...')

# load csv data
df = dd.read_csv(data_file_name, 
                 error_bad_lines=False,
                 assume_missing=True,
								 dtype={'ID': np.int64, 
									'Beat': np.uint16, 
									#'District': 'uint16', 
									#'Ward': 'uint16',
									#'Community Area': 'uint16',
									'Year': np.uint16, 
									'Location': 'str'},
                 parse_dates=['Date'], 
								 infer_datetime_format=True)

# persist data frame in memory
df = df.persist()

print('{}: All data loaded into memory.'\
	.format(datetime.now().strftime('%H:%M:%S')))

# log records count and load data partitions
print_line()
print('Data set info:')
print_line()
print('{:,} total records in {} partitions'\
	.format(len(df), df.npartitions))

# drop duplicates
df.drop_duplicates(subset=['ID', 'Case Number'], inplace=True)

print('DataFrame size: {:,}'.format(df.size.compute()))

# strip out white space from column names
df = df.rename(columns={c: c.replace(' ', '') for c in df.columns})

# list columns
print_line()
print('Columns:')
print_line()
print(df.columns)

# infer data types
print_line()
print('Column dtypes:')
print_line()
print(df.dtypes)

def unique_column_values(df):
  for column in df.columns:
    print('{} | {} | {}'.format(
      df[column].name,
      len(df[column].unique()),
      df[column].dtype))

# print unique column values counts
#print_line()
#print('Unique column values:')
#print_line()
#print('Name | Unique # | Type')
#unique_column_values(df)

# reduce data set
select_columns = ['Date', 'Block', 'PrimaryType',
                  'Description', 'LocationDescription', 'CommunityArea', 
                  'Arrest', 'Domestic', 'Latitude', 'Longitude', 'Year']
df = df[select_columns]

# print some dataset stats
print_line()
print('{}: Dataset stats...'\
	.format(datetime.now().strftime('%H:%M:%S')))
print_line()
print('{:,} total records'.format(len(df)))

# drop duplicates
print('Dropping duplicates...')
df = df.drop_duplicates() #.dropna()
print('{:,} unique records'.format(len(df)))

print('Calculating total arrests and domestic crime reports... (~3 min)')

# count arrests
arrests_df = df[df.Arrest==True]
print('{:,} arrests'.format(len(arrests_df)))

# count domestic crime reports
domestic_df = df[df.Domestic==True]
print('{:,} domestic crime reports'.format(len(domestic_df)))

# print data frame info
print_line()
print('{}: DataFrame info():'\
	.format(datetime.now().strftime('%H:%M:%S')))
print_line()
print(df.info())

# list reduced dataset columns
print_line()
print('Reduced dataset Columns:')
print_line()
print(df.columns)
print_line()

# save it in parquet format
parquet_data_folder = '../data/crimes-2001-to-present.snappy.parq' #'../data/crimes-2017.snappy.parq'
print('{}: Saving data in snappy parquet format to (~6 min): {} ...'\
	.format(datetime.now().strftime('%H:%M:%S'), parquet_data_folder))
print('...')
df.to_parquet(parquet_data_folder, compression='SNAPPY')
print('{}: Finished creating snappy parquet dataset at: {}'\
	.format(datetime.now().strftime('%H:%M:%S'), parquet_data_folder))







