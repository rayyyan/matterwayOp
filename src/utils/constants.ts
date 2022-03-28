export enum AllConst {
  GOOD_BASE = "https://www.goodreads.com",
  GOOD_READS = `https://www.goodreads.com/choiceawards/best-books-2020`,
  AMAZON = "https://www.amazon.com",
  //styles
  MODAL_STYLE = ` <style>
            #modal-content-matterway{
              position: fixed; 
              z-index: 1; 
              left: 0;
              top: 0;
              width: 100%; 
              height: 100%; 
              overflow: auto; 
              background-color: rgb(0,0,0); 
              background-color: rgba(0,0,0,0.4)
            }
            .modal-content-matterway{
              background-color: #fefefe;
              margin: 22% auto;
              padding: 20px;
              border: 1px solid #888;
              width: 80%;
              position: relative;
              min-height: 100px;
              display: flex;
              align-items: center;
          }
            
            .my-close{
              position: absolute;
              right: 5px;
              top: 3px;
              font-size: 32px;
              cursor: pointer;
            }
            #matterway{
              position: absolute;
              left: top: 3px;
            }
            </style>`,
}
