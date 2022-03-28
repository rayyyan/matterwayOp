import { Page } from "puppeteer"
import { AllConst } from "../utils/constants"
export enum ErrorLogs {
  NOT_AVAILABLE = "This book is not available",
  DELIVERY_BLOCK = "delivery location is beyond seller's shipping coverage",
  NO_BUYING_OPTIONS = "No buying options available",
}

export class Modal {
  static async showModal(error: string, page: Page) {
    try {
      await page.evaluate((error) => {
        const modal = document.createElement("div")
        modal.id = "modal-content-matterway"
        modal.innerHTML = `<style>
            #modal-content-matterway{
              position: fixed; 
              z-index: 350; 
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
            </style>
            <div class="modal-content-matterway">
            <img id="matterway" src="https://media-exp1.licdn.com/dms/image/C4D0BAQF8L0yk2jHoWQ/company-logo_200_200/0/1545320555771?e=2159024400&amp;v=beta&amp;t=YMk5zxTfdQGWA1iUq68cuOouJHuqpte79LIlp_kFkvM" style="width: 50px; height: 50px; margin: 5px;">
            <span class="my-close">&times;</span>
            <p style="margin: 0 auto;width: 100%; text-align: center;">${error}</p>
            </div>`
        document.body.appendChild(modal)
        const span = document.querySelector(".my-close")! as HTMLSpanElement
        span.addEventListener("click", () => {
          document.body.removeChild(modal)
        })
      }, error)
    } catch (error) {
      throw new Error("Can't show modal")
    }
  }
}
