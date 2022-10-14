/* eslint-disable */
import React from 'react';

const UploadDropZone = (props) => {
    const [uploadedFiles, setUploadedFiles] = React.useState([]);
    const scanFiles = (item, container) => {
      let elem = document.createElement("li");
      elem.textContent = item.name;
      container.appendChild(elem);

      if(!item.isDirectory) {
        setUploadedFiles(uploadedFiles => [...uploadedFiles, item])
        props.uploadDropZoneFiles(files => [...files, item])
      }

      if(item.isDirectory) {
        let directoryReader = item.createReader();
        let directoryContainer = document.createElement("ul");
        container.appendChild(directoryContainer);

        directoryReader.readEntries(function(entries) {
          entries.forEach(function(entry) {
            scanFiles(entry, directoryContainer);
          });
        });
      }
    }

    return (
        <div style={{margin: 20}} >
            <div
                className={'drop-zone'}
                style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                    height: window.innerHeight * 0.3,
                    color: '#042547',
                    fontSize: '1.5em',
                    border: 'dashed gray',
                    backgroundColor: "rgb(5, 156, 148, 0.3)",
                }}
                onDragEnter={e => { e.stopPropagation(); e.preventDefault() }}
                onDragOver={e => { e.stopPropagation(); e.preventDefault() }}
                onDragLeave={e => { e.stopPropagation(); e.preventDefault() }}
                onDrop={e => {
                    e.preventDefault();

                    let listing = document.getElementById("listing");
                    let items = e.dataTransfer.items;

                    listing.textContent = "";

                    for (let i=0; i<items.length; i++) {
                        let item = items[i].webkitGetAsEntry();

                        if (item) {
                            scanFiles(item, listing);
                        }
                    }

                }}
            >
                {uploadedFiles.length === 0 ? "Drop your files here." : ""}

                <div style={{
                  display: uploadedFiles.length === 0 ? 'none' : 'flex',
                  flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start',
                  fontSize: '0.7em',
                  overflowY: "scroll",
                  height: "100%",
                  paddingLeft: 15,
                }}>
                    <span><b>uploaded files: </b></span>
                    <ul id="listing" />
                </div>
            </div>
        </div>
    )
}

export default UploadDropZone;
