import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class LoginPage extends BasePage {

    async gotoLoginPage() {
        await this.page.goto('/login');
    }

    async login(username: string, password: string) {
        await this.getUsernameBox.fill(username),
        await this.getPasswordBox.fill(password)
        await this.getLoginButton.click();
    }

    async clickLogin(){
        await this.getLoginButton.click();
    }

    async loginPageTitle(){
        const titleText = await this.getLoginTitle.innerText();
        return titleText;
    }

    async flashMessage(){
        const titleText = await this.getFlashMessage.innerText();
        return titleText;
    }
}