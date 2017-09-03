# coding: utf-8
import numpy as np
import pandas as pd
import dask.dataframe as dd
from datetime import datetime

#---------------------------- Print Functions --------------------------------------------
# prints a line separator
def print_line():
    print('-------------------------------------------------------------------------------')  

# prints a msg with a timestamp
def log(msg):
	print('\n{}: {}'\
		.format(datetime.now().strftime('%H:%M:%S'), msg))

# prints dataframe info
def print_dataframe_info(df):
	print('\nDataFrame info:')
	print_line()
	print(df.info())
	print_line()
	
# prints # of records and partitions in a dataframe
def print_dataframe_size(df):
	print('{:,} total records in {} partitions'\
		.format(len(df), df.npartitions))
	print('DataFrame size: {:,}'.format(df.size.compute()))
	print_line()

# prints dataframe columns and dtypes
def print_columns(df):
	print('Columns:')
	print_line()
	print(df.columns)
	print_line()
	print('\nColumn dtypes:')
	print_line()
	print(df.dtypes)
	print_line()

# prints unique column value counts
def print_unique_column_values(df):
	print('\nUnique column values...')
	print_line()
	print('Name | Unique # | Type')
	for column in df.columns:
		print('{} | {} | {}'.format(
			df[column].name,
			len(df[column].unique()),
			df[column].dtype))
	print_line()

#---------------------------- Data Processing Script ---------------------------------------

# load csv data into dask df
# Note: change this to parse smaller ~39Mb 2017 crime data file included in this repo
data_file_name = '../raw_data/Crimes_-_2001_to_present.csv' #'../data/Crimes_-_2017.csv'
log('Loading data file: {} ...'.format(data_file_name))
if data_file_name.endswith('Crimes_-_2001_to_present.csv'):
	print('This might take half an hour on a quad core with fast SDD and 4Gb of ram to spare.')
	print('\tRun it before you step out for lunch :)\n...')
else:
	print('\tGive it a few minutes to load raw data. Go grab some coffee.\n...')

# load csv data
df = dd.read_csv(data_file_name, 
                 error_bad_lines=False,
                 assume_missing=True,
				 dtype={'ID': np.int64,
				 'PrimaryType': 'str',
				 'FBICode': 'str',
				 'Beat': np.uint16,
				 #'District': np.uint16,
				 #'Ward': np.uint16,
				 #'Community Area': 'uint16',
				 'Year': np.uint16,
				 'Location': 'str'},
                 parse_dates=['Date'],
				 infer_datetime_format=True)

# persist dataframe in memory
df = df.persist()
log('All data loaded into memory.')

# print raw data stats
print_dataframe_info(df)
print_columns(df)
if data_file_name.endswith('Crimes_-_2017.csv'):
	print_unique_column_values(df) # for small data sets only
print_dataframe_size(df)

# drop duplicate cases
log('Dropping duplicate cases...')
df.drop_duplicates(subset=['ID', 'Case Number'], inplace=True)

# strip out white space from column names
df = df.rename(columns={c: c.replace(' ', '') for c in df.columns})

# reduce dataframe to the select columns we need for charting crime stats
log('Dropping some columns...')
select_columns = ['Date', 'Block', 'PrimaryType', 'FBICode',
                  'Description', 'LocationDescription', 
				  'CommunityArea', 'Beat', 'District', 'Ward',
                  'Arrest', 'Domestic', 'Latitude', 'Longitude', 'Year']
df = df[select_columns]
#df = df.drop(['ID', 'CaseNumber', 'IUCR', 'Beat', 'District', 'Ward',\
#	'FBICode', 'UpdatedOn', 'Location'], axis=1) # denotes column

# drop duplicate records
log('Dropping duplicate records...')
df = df.drop_duplicates() #.dropna()
print('{:,} unique records'.format(len(df)))

# list reduced dataset columns
log('Reduced DataFrame Columns:')
print_columns(df)

# set Date index
log('Creating Date index...')
df = df.set_index('Date')

# create data categories to shrink data size on disk
log('Creating data categories...')
df = df.categorize(columns=['PrimaryType', 'FBICode', 
	'Description', 'LocationDescription', 
	'CommunityArea', 'Beat', 'District', 'Ward', 'Year'])

# print data frame info before save
log('Reduced DataFrame info...')
print_dataframe_info(df)

# save dataframe in compressed snappy parquet format
parquet_data_folder = '../data/crimes-2001-to-present.snappy.parq' #'../data/crimes-2017.snappy.parq'
log('Saving data in snappy parquet format to: {} ...'.format(parquet_data_folder))
print('...')
df.to_parquet(parquet_data_folder, compression='SNAPPY') #, partition_on=['Year']) #,write_index=True)
log('Finished creating snappy parquet dataset at: {}'.format(parquet_data_folder))
