import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';

// TODO: Better understand and improve this config along with tsconfig.
/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      prettier,
    },
		rules: {
			'react/react-in-jsx-scope': 'off'
		},
		settings: {
			react: {
				version: 'detect'
			}
		}
  },
	{
		plugins: {
			'react-hooks': hooksPlugin,
		},
		rules: hooksPlugin.configs.recommended.rules,
	}
];
