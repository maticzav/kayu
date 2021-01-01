import { getIntrospectionQuery, IntrospectionQuery } from 'graphql'
/* Configuration */

/* Program */

async function main() {
  const query = getIntrospectionQuery()
  const result = 0 // fetch from server

  const schema: IntrospectionQuery = schema
}

/* Poženemo program */

if (require.main === module) {
  main()
}
