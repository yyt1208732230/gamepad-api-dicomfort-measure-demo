var test_array = [["name1", 2, 3], ["name2", 4, 5], ["name3", 6, 7], ["name4", 8, 9], ["name5", 10, 11]];


// Construct the comma seperated string
// If a column values contains a comma then surround the column value by double quotes
const transferArray = (array) => {
    let _array = null;
    _array = array.map(row => 
        row.map(item => 
            (typeof item === 'string' && item.indexOf(',') >= 0) ? `"${item}"` : JSON.stringify(item)).join(',')
    ).join('\n');
    return _array;
}
// const csv = test_array.map(row => row.map(item => (typeof item === 'string' && item.indexOf(',') >= 0) ? `"${item}"` : String(item)).join(',')).join('\n');

// Download CSV
const downloadRecordFile = (array, fileName = null, type = 'txt') => {
    // Format the CSV string
    let data = encodeURI('data:text/csv;charset=utf-8,' + array);

    // Create a virtual Anchor tag
    const link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', fileName + '.' + type);

    // Append the Anchor tag in the actual web page or application
    document.body.appendChild(link);

    // Trigger the click event of the Anchor link
    link.click();

    // Remove the Anchor link form the web page or application
    document.body.removeChild(link);
}