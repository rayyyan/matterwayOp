export enum Exceptions {
  NOT_AVAILABLE = "https://www.amazon.com/Metropolitan-Underground-Rolling-Wight-Number/dp/B01N6PKN9V",
  SEE_BUYING_OPTIONS = "https://www.amazon.com/Thomas-Guide-California-Road-Atlas/dp/B00A2NICZ0/",
  HARDCOVER_ONLY = "https://www.amazon.com/Piranesi-Unbound-Carolyn-Yerkes/dp/0691206104/ref=sr_1_1?keywords=Piranesi+Unbound+Hardcover&qid=1648365547&sr=8-1",
  LOCATION = "https://www.amazon.com/Hobbit-Lord-Rings-Boxed-Set/dp/0008376107/ref=sr_1_8?crid=3H0NAGF7853CM&keywords=J.R.R.+Tolkien+4-Book+Boxed+Set%3A+The+Hobbit+and+The+Lord+of+the+Rings&qid=1648284550&sprefix=j.r.r.+tolkien+4-book+boxed+set+the+hobbit+and+the+lord+of+the+rings%2Caps%2C217&sr=8-8",
  NO_BUYING_OPTIONS = "https://www.amazon.com/Bear-Creek-Brides-Historical-Western/dp/B08YCV41MF/ref=sr_1_2?crid=9GRUHK7FCVQF&keywords=audiobook&qid=1648369579&sprefix=audio+book%2Caps%2C406&sr=8-2",
}

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
