# coding: utf-8
import numpy as np
import pandas as pd
import dask.dataframe as dd

def print_line():
    print('------------------------------------------------------------')    
    
# load csv data into dask df
data_file_name = '../raw_data/Crimes_-_2017.csv' # data/Chicago-crimes-2017.csv'
print('Loading data file: {} ...'.format(data_file_name))
df = dd.read_csv(data_file_name, 
                 error_bad_lines=False,
                 assume_missing=True, # dtype={'Ward': int}) #dtype='str')
                 parse_dates=['Date'], infer_datetime_format=True)

# persist in memory
df = df.persist()

# log records count and load data partitions
print_line()
print('Data set info:')
print_line()
print('{:,} total records in {} partitions'.format(len(df), df.npartitions))

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
print_line()
print('Unique column values:')
print_line()
print('Name | Unique # | Type')
unique_column_values(df)

# reduce data set
select_columns = ['Date', 'Block', 'PrimaryType',
                  'Description', 'LocationDescription', 
                  'Arrest', 'Domestic', 'Latitude', 'Longitude']
df = df[select_columns]

# print some stats
print_line()
print('Data set stats:')
print_line()
print("{:,} total records".format(len(df)))

# drop duplicates
df = df.drop_duplicates() #.dropna()
print('{:,} unique records'.format(len(df)))

# count arrests
arrests_df = df[df.Arrest==True]
print('{:,} arrests'.format(len(arrests_df)))

# domestic
domestic_df = df[df.Domestic==True]
print('{:,} domestic crime reports'.format(len(domestic_df)))

# print data frame info
print_line()
print('DataFrame info():')
print_line()
print(df.info())
print_line()

# save it in parquet format
parquet_file_name = '../data/Chicago-crimes-2017.parq'
print('Converting to parquet format: {} ...'.format(parquet_file_name))
print('...')
df.to_parquet(parquet_file_name)






