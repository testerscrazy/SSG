import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class SecureAreaPage extends BasePage {

    async gotoSecurePage() {
        await this.page.goto('/secure');
    }

    async secureAreaTitle(){
        const titleText = await this.getSecureAreaTitle.innerText();
        return titleText;
    }

    async flashMessage(){
        const titleText = await this.getFlashMessage.innerText();
        return titleText;
    }

    async loggedOut(){
        await this.getLogoutButton.click();
    }
}