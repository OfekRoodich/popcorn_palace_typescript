"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("./app.module");
describe('AppModule', () => {
    it('should compile the module without errors', async () => {
        const module = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        expect(module).toBeDefined();
    });
});
//# sourceMappingURL=app,module.spec.js.map