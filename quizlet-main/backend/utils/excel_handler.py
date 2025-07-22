import pandas as pd

def read_excel(file_path: str, custom_header=None):
    try:
        raw_data = {}
        with pd.ExcelFile(file_path) as xls:
            raw_data = pd.read_excel(xls)
        df = pd.DataFrame(data=raw_data)
        # handler custom header. TODO

        result = df.to_json(orient='records')
        return result
    except Exception as err:
        return (err) 