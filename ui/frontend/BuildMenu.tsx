import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';

import ButtonMenuItem from './ButtonMenuItem';
import MenuAside from './MenuAside';
import MenuGroup from './MenuGroup';
import * as actions from './actions';
import { useAppDispatch } from './configureStore';
import * as selectors from './selectors';

import styles from './BuildMenu.module.css';

interface BuildMenuProps {
  close: () => void;
}

const useDispatchAndClose = (action: () => actions.ThunkAction, close: () => void) => {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    dispatch(action());
    close();
  }, [action, close, dispatch]);
};

const BuildMenu: React.FC<BuildMenuProps> = (props) => {
  const isHirAvailable = useSelector(selectors.isHirAvailable);
  const wasmLikelyToWork = useSelector(selectors.wasmLikelyToWork);

  const compile = useDispatchAndClose(actions.performCompile, props.close);
  const compileToAssembly = useDispatchAndClose(actions.performCompileToAssembly, props.close);
  const compileToLLVM = useDispatchAndClose(actions.performCompileToLLVM, props.close);
  const compileToMir = useDispatchAndClose(actions.performCompileToMir, props.close);
  const compileToHir = useDispatchAndClose(actions.performCompileToNightlyHir, props.close);
  const compileToWasm = useDispatchAndClose(actions.performCompileToWasm, props.close);
  const execute = useDispatchAndClose(actions.performExecute, props.close);
  const test = useDispatchAndClose(actions.performTest, props.close);

  return (
    <MenuGroup title="What do you want to do?">
      <ButtonMenuItem name="Run" onClick={execute}>
        Build and run the code, showing the output. Equivalent to <Code>cargo run</Code>.
      </ButtonMenuItem>
      <ButtonMenuItem name="Build" onClick={compile}>
        Build the code without running it. Equivalent to <Code>cargo build</Code>.
      </ButtonMenuItem>
      <ButtonMenuItem name="Test" onClick={test}>
        Build the code and run all the tests. Equivalent to <Code>cargo test</Code>.
      </ButtonMenuItem>
      <ButtonMenuItem name="ASM" onClick={compileToAssembly}>
        Build and show the resulting assembly code.
      </ButtonMenuItem>
      <ButtonMenuItem name="LLVM IR" onClick={compileToLLVM}>
        Build and show the resulting LLVM IR, LLVM’s intermediate representation.
      </ButtonMenuItem>
      <ButtonMenuItem name="MIR" onClick={compileToMir}>
        Build and show the resulting MIR, Rust’s control-flow-based intermediate representation.
      </ButtonMenuItem>
      <ButtonMenuItem name="HIR" onClick={compileToHir}>
        Build and show the resulting HIR, Rust’s syntax-based intermediate representation.
        {!isHirAvailable && <HirAside />}
      </ButtonMenuItem>
      <ButtonMenuItem name="Wasm" onClick={compileToWasm}>
        Build a WebAssembly module for web browsers, in the .WAT textual representation.
        {!wasmLikelyToWork && <WasmAside />}
      </ButtonMenuItem>
    </MenuGroup>
  );
};

const Code: React.FC<{ children: string }> = ({ children }) => (
  <code className={styles.code}>{children}</code>
);

const HirAside: React.FC = () => (
  <MenuAside>
    Note: HIR currently requires using the Nightly channel, selecting this option will switch to
    Nightly.
  </MenuAside>
);

const WasmAside: React.FC = () => (
  <MenuAside>
    Note: WebAssembly works best when using the <Code>cdylib</Code> crate type, but the source code
    does not specify an explicit crate type. Selecting this option will change the code to specify{' '}
    <Code>cdylib</Code>.
  </MenuAside>
);

export default BuildMenu;
