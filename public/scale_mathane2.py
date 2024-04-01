import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler

file_path = 'public/data/original/SimulatedDataHR-Part2.txt'

data = pd.read_fwf(file_path, colspecs=[(0,8), (19,27), (31,40), (185,196)]) 

# Convert 'Methane' column to numeric, forcing non-numeric values to NaN
# data['Methane'] = pd.to_numeric(data['Methane'], errors='coerce')

# Diagnostic print
# print(data['Methane'].unique())
# print("Shape after conversion:", data.shape)

# Print a sample of the 'Methane' column after conversion
print(data)

# Temporarily comment out the dropping of NaNs to explore the data
# data.dropna(subset=['Methane'], inplace=True)
# print("Shape after dropping NaNs:", data.shape)
