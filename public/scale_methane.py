import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# Adjust the file path as needed
file_path = 'public/data/original/SimulatedDataHR3-Part2.txt'

# Use colspecs to read specific columns
data = pd.read_fwf(file_path, colspecs=[(0,8), (19,27), (31,40), (185,196)])

# Check for non-numeric values in the 'Methane' column
print(data['Methane'].unique())

# Convert 'Methane' column to numeric, forcing non-numeric values to NaN (optional)
data['Methane'] = pd.to_numeric(data['Methane'], errors='coerce')

# Drop rows with NaN values in 'Methane' column if any non-numeric values were converted to NaN
data.dropna(subset=['Methane'], inplace=True)

# Initialize scalers
standard_scaler = StandardScaler()
minmax_scaler = MinMaxScaler()

# Scale the Methane column
data['MSS'] = standard_scaler.fit_transform(data[['Methane']])
data['MMMS'] = minmax_scaler.fit_transform(data[['Methane']])

# Convert DataFrame to string with desired formatting
formatted_data = data.to_string(index=False, header=True, col_space=15)

# Save the formatted string to a new file
with open('public/data/scaled/NewUpdatedSimulatedDataHR3-Part2.txt', 'w') as file:
    file.write(formatted_data)


# Save the updated data back to a new file
# data.to_csv('public/data/UpdatedSimulatedData.txt', sep=' ', index=False, float_format='%.5f')
