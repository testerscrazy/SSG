import { expect, test } from '@playwright/test'
import { LoginPage } from '../pages/loginPage'
import { SecureAreaPage } from '../pages/secureAreaPage'
const { chromium } = require('playwright-core');

let browser;
let loginPage: LoginPage;
let secureAreaPage: SecureAreaPage;

test.beforeAll(async () => {
    browser = await chromium.launch();
});

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
})

test("As a User I verify that the Practice login page exist", async ({ page }) => {
    loginPage = new LoginPage(page);
    await expect(page.url()).toEqual(process.env.PAGE_URL + "login");
})

test("As a User I verify that the Practice login page title is exist and correct", async ({ page }) => {
    loginPage = new LoginPage(page);
    const actualTitle = await loginPage.loginPageTitle();
    const expectedTitle = "Login Page";
    await expect(actualTitle).toEqual(expectedTitle);
})

test("As a User when I login to Practice page with valid username and password and verify that I'm at secure page ", async ({ page }) => {
    loginPage = new LoginPage(page);
    secureAreaPage = new SecureAreaPage(page);
    const expectedFlashMessage = "You logged into a secure area!";
    const expectedTitle = "Secure Area";
    await loginPage.login(process.env.TEST_USERNAME || '', process.env.TEST_PASSWORD || '');
    const actualFlashMessage = await secureAreaPage.flashMessage();
    const actualTitle = await secureAreaPage.secureAreaTitle();
    await expect(actualFlashMessage).toEqual(expectedFlashMessage);
    await expect(actualTitle).toEqual(expectedTitle);
    await expect(page.url()).toEqual(process.env.PAGE_URL + "secure");
})

test("As a User I try to go directly to the Secure page without login and verify the error message", async ({ page }) => {
    loginPage = new LoginPage(page);
    secureAreaPage = new SecureAreaPage(page);
    await secureAreaPage.gotoSecurePage();
    const expectedFlashErrorMessage = "You must login to view the secure area!";
    const actualFlashErrorMessage = await loginPage.flashMessage();
    await expect(actualFlashErrorMessage).toEqual(expectedFlashErrorMessage);
})

test("As a User when I click the login button without entering username or password in the Practice page and then verify the error message", async ({ page }) => {
    loginPage = new LoginPage(page);
    secureAreaPage = new SecureAreaPage(page);
    const expectedFlashErrorMessage = "Your username is invalid!"; // User is getting this message when username and password is not provided, message should be "required informations not provided" 
    await loginPage.clickLogin();
    const actualFlashErrorMessage = await loginPage.flashMessage();
    await expect(actualFlashErrorMessage).toEqual(expectedFlashErrorMessage);
})

test("As a User when I click the login button after entering valid username and invalid password in the Practice page and then verify the error message", async ({ page }) => {
    loginPage = new LoginPage(page);
    secureAreaPage = new SecureAreaPage(page);
    const expectedFlashErrorMessage = "Your password is invalid!"; // This poses a security risk. The error message should not reveal whether the password is invalid.
    await loginPage.login(process.env.TEST_USERNAME || '', 'invalid-password');
    const actualFlashErrorMessage = await loginPage.flashMessage();
    await expect(actualFlashErrorMessage).toEqual(expectedFlashErrorMessage);
})

test("As a User when I click the login button with entering invalid username and a valid password in the Practice page and then verify the error message", async ({ page }) => {
    loginPage = new LoginPage(page);
    secureAreaPage = new SecureAreaPage(page);
    const expectedFlashErrorMessage = "Your username is invalid!"; // This poses a security risk. The error message should not reveal whether the username is invalid.
    await loginPage.login('invalid-username', process.env.TEST_PASSWORD || '');
    const actualFlashErrorMessage = await loginPage.flashMessage();
    await expect(actualFlashErrorMessage).toEqual(expectedFlashErrorMessage);
})

test("As a User when I click the login button with entering invalid username and invalid password in the Practice page and then verify the error message", async ({ page }) => {
    loginPage = new LoginPage(page);
    secureAreaPage = new SecureAreaPage(page);
    const expectedFlashErrorMessage = "Your username is invalid!"; // User is getting this message when username and password invalid, message should be "provided credential not valid" 
    await loginPage.login('invalid-username', 'invalid-password');
    const actualFlashErrorMessage = await loginPage.flashMessage();
    await expect(actualFlashErrorMessage).toEqual(expectedFlashErrorMessage);
})

test("As a User when I log out from the Secure page and then verify the successful message, and the Login page title is visible", async ({ page }) => {
    loginPage = new LoginPage(page);
    secureAreaPage = new SecureAreaPage(page);
    const expectedFlashMessage = "You logged out of the secure area!";
    const expectedTitle = "Login Page";
    await loginPage.login(process.env.TEST_USERNAME || '', process.env.TEST_PASSWORD || '');
    await secureAreaPage.loggedOut();
    const actualFlashMessage = await loginPage.flashMessage();
    const actualTitle = await loginPage.loginPageTitle();
    await expect(actualFlashMessage).toEqual(expectedFlashMessage);
    await expect(actualTitle).toEqual(expectedTitle);
})

test("As a User when I login to the Practice page with valid username with Capital case and valid password and then verify the error message ", async ({ page }) => {
    loginPage = new LoginPage(page);
    secureAreaPage = new SecureAreaPage(page);
    const expectedFlashErrorMessage = "Your username is invalid!"; // This poses a security risk. The error message should not reveal whether the username is invalid.
    const capitalUsername = (process.env.TEST_USERNAME || '').toUpperCase();
    await loginPage.login(capitalUsername, process.env.TEST_PASSWORD || '');
    const actualFlashErrorMessage = await loginPage.flashMessage();
    await expect(actualFlashErrorMessage).toEqual(expectedFlashErrorMessage);
})

test("As a User when I login to the Practice page with valid username and password with Capital case and then verify the error message ", async ({ page }) => {
    loginPage = new LoginPage(page);
    secureAreaPage = new SecureAreaPage(page);
    const expectedFlashErrorMessage = "Your password is invalid!"; // This poses a security risk. The error message should not reveal whether the password is invalid.
    const capitalPassword = (process.env.TEST_PASSWORD || '').toUpperCase();
    await loginPage.login(process.env.TEST_USERNAME || '', capitalPassword);
    const actualFlashErrorMessage = await loginPage.flashMessage();
    await expect(actualFlashErrorMessage).toEqual(expectedFlashErrorMessage);
})

test.afterEach(async ({ page }) => {
    await page.close();
});

test.afterAll(async ({ browser }) => {
    await browser.close();
})