import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler

file_path = 'public/data/scaled/NewUpdatedSimulatedData.txt'

data = pd.read_fwf(file_path) 

# Convert 'Methane' column to numeric, forcing non-numeric values to NaN
# data['Methane'] = pd.to_numeric(data['Methane'], errors='coerce')

# Diagnostic print
# print(data['Methane'].unique())
# print("Shape after conversion:", data.shape)

# Print a sample of the 'Methane' column after conversion
print(data["Time"])

# Temporarily comment out the dropping of NaNs to explore the data
# data.dropna(subset=['Methane'], inplace=True)
# print("Shape after dropping NaNs:", data.shape)
