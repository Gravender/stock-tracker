import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type JSXElementConstructor,
} from "react";

export type AsProperty<C extends ElementType> = {
  /*
   * An override of the default HTML tag.
   * Can also be another React component.
   */
  as?: C;
};

export type PropsOf<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  C extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
> = JSX.LibraryManagedAttributes<C, ComponentPropsWithoutRef<C>>;

export type ExtendableProps<
  ExtendedProperties = Record<string, unknown>,
  OverrideProperties = Record<string, unknown>,
> = OverrideProperties & Omit<ExtendedProperties, keyof OverrideProperties>;

export type InheritableElementProps<
  C extends ElementType,
  Properties = Record<string, unknown>,
> = ExtendableProps<PropsOf<C>, Properties>;

export type PolymorphicComponentProps<
  C extends ElementType,
  Properties = Record<string, unknown>,
> = InheritableElementProps<C, Properties & AsProperty<C>>;
