import react from '@vitejs/plugin-react-swc';
import eslint from 'vite-plugin-eslint';
import {
  configDefaults,
  coverageConfigDefaults,
  defineConfig,
  // eslint-disable-next-line import/no-unresolved
} from 'vitest/config';

export default defineConfig({
  base: '/',
  envPrefix: 'REACT_APP_',
  plugins: [react(), eslint()],
  build: {
    outDir: './build',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // inline dynamic imports, because rollup generates so many chunks it triggers
        inlineDynamicImports:
          process.env.ROLLUP_INLINE_DYNAMIC_IMPORTS === 'true',
        experimentalMinChunkSize: 100_000, // try to avoid small chunks that are less than 100 kB
      },
    },
  },
  server: {
    host: true,
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    exclude: [...configDefaults.exclude, 'e2e/tests'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    reporters: ['verbose', 'junit'],
    outputFile: {
      junit: './jest-report.xml',
    },
    coverage: {
      reporter: ['clover', 'json', 'lcov', 'text', 'cobertura'],
      include: ['src/**/*'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/__mocks__/**',
        '**/__snapshots__/**',
        'build/**',
        '**/constants.ts',
        '**/constants.tsx',
        '**/types.ts',
        '**/mutation.ts',
        '**/query.ts',
        '.*.d.ts',
        'src/index.tsx',
        'src/common/components/imageUploader/utils.ts',
        'src/common/components/imageUploader/imageCropper/ImageCropper.tsx',
        'src/common/components/menuDropdown/menu/Menu.tsx',
        'src/common/components/table/bodyRow/BodyRow.tsx',
        'src/common/components/table/sortingHeaderCell/SortingHeaderCell.tsx',
        'src/common/components/table/tableBody/TableBody.tsx',
        'src/common/components/table/tableContainer/TableContainer.tsx',
        'src/common/components/map/',
        'src/domain/app/apollo/apolloClient.ts',
        'src/domain/app/apollo/clearCacheUtils.ts',
        'src/domain/app/apollo/utils.ts',
        'src/domain/app/hooks/usePageSettings.ts',
        'src/domain/app/i18n/i18nInit.ts',
        'src/domain/app/theme/Theme.tsx',
        'src/domain/auth/hooks/useAuth.ts',
        'src/domain/auth/oidcCallback/OidcCallback.tsx',
        'src/domain/event/formSections/timeSection/hooks/useTimeSectionContext.ts',
        'src/domain/event/formSections/timeSection/TimeSectionContext.tsx',
        'src/domain/help/pages/DocumentationPage.tsx',
        'src/domain/organizations/organizationsTable/OrganizationsTableContext.tsx',
        'src/generated/graphql.tsx',
        'src/icons/',
        'src/test/',
        'src/utils/mockDataUtils.ts',
        'src/utils/getPageHeaderHeight.ts',
        'src/utils/testUtils.tsx',
        'src/utils/typescript.ts',
      ],
      provider: 'istanbul',
    },
    testTimeout: 1000000,
  },
});
