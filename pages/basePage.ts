import {Page, Locator} from "@playwright/test"

export class BasePage{
    readonly page: Page;

    readonly getUsernameBox: Locator;
    readonly getPasswordBox: Locator;
    readonly getLoginButton: Locator;
    readonly getLoginTitle: Locator;

    readonly getFlashMessage: Locator;
    readonly getLogoutButton: Locator;
    readonly getSecureAreaTitle: Locator;

    constructor(page: Page){
        this.page = page;
        this.getUsernameBox = page.locator('#username');
        this.getPasswordBox = page.getByRole('textbox', {name: "password"});
        this.getLoginButton = page.locator('[type ="submit"]');
        this.getLoginTitle = page.locator('//h1[contains(text(), "Login Page")]')
        
        this.getFlashMessage = page.locator('#flash-message')
        this.getLogoutButton = page.locator('.icon-signout:has-text("Logout")');
        this.getSecureAreaTitle = page.locator('//h1[contains(text(), "Secure Area")]')
    }
}