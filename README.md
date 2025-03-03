# Supplier Review and Selection System

A Next.js application for managing and evaluating supplier offers with enhanced decision support features.

## Features

- **Supplier Offer Comparison**: Compare multiple supplier offers with sortable tables
- **Q&A Communication**: Thread-based communication with suppliers
- **DFM Feedback**: Design for Manufacturing feedback management
- **Offer Variations**: Track and compare different offer variations
- **Requirement Confirmation**: Verify and track requirement fulfillment
- **Document Management**: Upload, track, and comment on supplier documents
- **Compliance Verification**: Track and verify supplier certifications
- **Timeline Visualization**: Visualize production timelines and milestones
- **Decision Support**: Weighted scoring and team voting system

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app/production/` - Production-related pages
  - `/review/` - Supplier review and selection
  - `/suppliers/` - Supplier management
  - `/setup/` - Initial setup
- `/src/components/` - Reusable React components
  - Decision support components
  - Communication components
  - Document management components

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add some amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
