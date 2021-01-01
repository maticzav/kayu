import { ml } from 'multilines'
import {
  GraphQLSchema,
  IntrospectionEnumType,
  IntrospectionInputObjectType,
  IntrospectionInterfaceType,
  IntrospectionObjectType,
  IntrospectionScalarType,
  IntrospectionSchema,
  IntrospectionUnionType,
  visit,
} from 'graphql'
import * as prettier from 'prettier'
import * as os from 'os'

import { never } from './utils'
import { getNamedTypeRef } from './ast'

type ScalarMap = Map<string, string>

class GQLGenerator {
  /* State */

  private scalarMappings: ScalarMap
  private schema: IntrospectionSchema

  /* Initializer */

  constructor(schema: IntrospectionSchema, scalars: ScalarMap) {
    this.scalarMappings = scalars
    this.schema = schema
  }

  /* Scalars */

  /**
   * Returns the mapped value of a scalar.
   */
  private scalar(type: string): string {
    if (this.scalarMappings.has(type)) {
      return this.scalarMappings.get(type)!
    }
    throw new Error(`Unknown scalar "${type}".`)
  }

  /* Schema Accessors */

  /**
   * Returns all the scalar types in the schema.
   */
  scalars(): IntrospectionScalarType[] {
    let scalars: IntrospectionScalarType[] = []

    for (const type of this.schema.types) {
      switch (type.kind) {
        case 'SCALAR': {
          scalars.push(type)
        }
      }
    }

    return scalars
  }

  /**
   * Returns all the objects in schema.
   */
  objects(): IntrospectionObjectType[] {
    let objects: IntrospectionObjectType[] = []

    for (const type of this.schema.types) {
      switch (type.kind) {
        case 'OBJECT': {
          objects.push(type)
        }
      }
    }

    return objects
  }

  /**
   * Returns all the objects in schema.
   */
  unions(): IntrospectionUnionType[] {
    let unions: IntrospectionUnionType[] = []

    for (const type of this.schema.types) {
      switch (type.kind) {
        case 'UNION': {
          unions.push(type)
        }
      }
    }

    return unions
  }

  /**
   * Returns all the enums in the schema.
   */
  enums(): IntrospectionEnumType[] {
    let enums: IntrospectionEnumType[] = []

    for (const type of this.schema.types) {
      switch (type.kind) {
        case 'ENUM': {
          enums.push(type)
        }
      }
    }

    return enums
  }

  /**
   * Returns all the interfaces in the schema.
   */
  interfaces(): IntrospectionInterfaceType[] {
    let interfaces: IntrospectionInterfaceType[] = []

    for (const type of this.schema.types) {
      switch (type.kind) {
        case 'INTERFACE': {
          interfaces.push(type)
        }
      }
    }

    return interfaces
  }

  /**
   * Returns all the input objects in the schema.
   */
  inputObjects(): IntrospectionInputObjectType[] {
    let inputObjects: IntrospectionInputObjectType[] = []

    for (const type of this.schema.types) {
      switch (type.kind) {
        case 'INPUT_OBJECT': {
          inputObjects.push(type)
        }
      }
    }

    return inputObjects
  }

  /* Generator */

  /**
   * Generates the selection library.
   */
  generate(): string {
    /* Generates chunks of code */
    const code = [
      /* Imports */
      ...this.generateImports(),
    ].join(os.EOL)

    /* Formats the code. */

    const prettified = prettier.format(code, {
      parser: 'typescript',
    })

    return prettified
  }

  /**
   * Generates imports that library needs.
   */
  generateImports(): string[] {
    return [
      "import { composite, leaf, fragment, SelectionSet, Fields, selection, string, boolean, int, float } from './'",
    ]
  }

  /**
   * Object type holds information about all return types from the schema and their
   * identifiers that we use as a reference for TypeLocks.
   *
   * We predefine identifiers to get better error messages and type
   * annotations by the IDE.
   */
  generateObjectTypes(): string[] {
    let code: string[] = []
    let index: string[] = []

    /**
     * Generate object declaration for each object.
     */
    for (const type of this.objects()) {
      const id = `${type.name}Object`

      // Make a checkmark in the index.
      index.push(`${type.name}: ${id}`)

      // Push object definition code to types.
      code.push(`type ${id} = {`)
      for (const field of type.fields) {
        const type = getNamedTypeRef(field.type)

        // OPTIONALS!!

        switch (type.kind) {
          case 'ENUM':
            code.push(`${field.name}: Enum['${type.name}']`)
          case 'OBJECT':
            code.push(`${field.name}: Object['${type.name}']`)
          case 'SCALAR': // TODO: how do we get the correct scalar type?
            code.push(`${field.name}: ${this.scalar(type.name)}`)
          case 'INPUT_OBJECT':
            console.log('TODO')
          case 'INTERFACE':
            console.log('TODO!!!')
          case 'UNION':
            console.log('TODO!!')
        }
      }

      code.push(`}`, os.EOL)
    }

    /**
     * Generate index at the end.
     */
    code.push(`type Object = {`)
    code.push(...index)
    code.push(`}`)

    return code
  }

  /**
   * Generates enumeration values to use them in the code.
   *
   * We predefine enums to get better error messages and type annotations by the IDE
   * and create an index that namespaces all the enums.
   */
  generateEnums(): string[] {
    let code: string[] = []
    let index: string[] = []

    /**
     * Generate objects and make index references
     * as you check each of them.
     */
    for (const type of this.enums()) {
      const id = `${type.name}Enum`
      index.push(`${type.name}: ${id}`)

      code.push(`enum ${id} {`)
      for (const field of type.enumValues) {
        code.push(`${field.name} = "${field.name}",`)
      }
      code.push(`}`, os.EOL)
    }

    /**
     * Generate index using references.
     */
    code.push(`type Enum = {`)
    code.push(...index)
    code.push(`}`)

    return code
  }

  /**
   * FieldTypes represent all the possible fields user may use to make a selection in a given type.
   * This function creates a type-dictionary of these fields (i.e. for each type in the schema one branch).
   */
  generateFieldTypes(): string[] {
    let code: string[] = ['type FieldsTypes = {']

    /**
     * Examine each type in the schema and push the selection to the code.
     */
    for (const type of this.objects()) {
      code.push(`${type.name}: {`)

      /**
       * Generate appropriate field definition for each field in a type.
       */
      for (const field of type.fields) {
      }

      code.push('}')
    }

    code.push('}')

    return code
  }
}
