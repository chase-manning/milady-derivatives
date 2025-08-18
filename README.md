<img width="1500" alt="image" src="https://user-images.githubusercontent.com/53957795/212746403-bcfe2281-4139-4df9-9169-34936985a35b.png">

# Milady Derivatives

An unofficial list of Milady Derivatives maintained by the community.

If you're interested in contributing check out our [Contribution Guide](https://github.com/chase-manning/milady-derivatives/blob/main/.github/CONTRIBUTING.md).

Or if you know if any missing derivatives please [let me know](https://twitter.com/chase_manning_) and I will add them 😃

## Development

### Data Validation

This project includes comprehensive validation for the `data.json` file to ensure data integrity and consistency.

#### Running Tests

```bash
# Run all tests
yarn test

# Run only data validation tests
yarn test:data
```

#### What Gets Validated

- **Data Structure**: All required fields are present and have correct types
- **Field Validation**:
  - `openseaId`: Unique, URL-friendly format
  - `name`: Non-empty, reasonable length
  - `description`: Non-empty, reasonable length
  - `chainId`: Valid blockchain network ID
  - `volume`: Non-negative number
  - `image`: Valid path format
- **Image Files**: All referenced image files exist in `public/api/images/`
- **Image Size**: All images must be under 500KB (validated by `scripts/validate-images.sh`)
- **Data Quality**: Reasonable value ranges and format consistency

#### CI Integration

The validation runs automatically in CI on every pull request, ensuring data quality is maintained.
