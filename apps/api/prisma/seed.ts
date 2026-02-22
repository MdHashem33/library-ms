import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@library.com' },
    update: {},
    create: {
      email: 'admin@library.com',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Create librarian
  const librarianPassword = await bcrypt.hash('Librarian123!', 10);
  const librarian = await prisma.user.upsert({
    where: { email: 'librarian@library.com' },
    update: {},
    create: {
      email: 'librarian@library.com',
      name: 'Library Staff',
      password: librarianPassword,
      role: Role.LIBRARIAN,
    },
  });

  // Create member
  const memberPassword = await bcrypt.hash('Member123!', 10);
  const member = await prisma.user.upsert({
    where: { email: 'member@library.com' },
    update: {},
    create: {
      email: 'member@library.com',
      name: 'John Doe',
      password: memberPassword,
      role: Role.MEMBER,
    },
  });

  // Create sample books
  const books = [
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      description: 'A Handbook of Agile Software Craftsmanship',
      genre: ['Programming', 'Software Engineering'],
      publisher: 'Prentice Hall',
      publishedAt: new Date('2008-08-01'),
      pages: 464,
      copies: 3,
      available: 3,
      location: 'A-01',
      tags: ['clean code', 'refactoring', 'best practices'],
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'David Thomas, Andrew Hunt',
      isbn: '9780135957059',
      description: 'Your Journey to Mastery',
      genre: ['Programming', 'Software Engineering'],
      publisher: 'Addison-Wesley',
      publishedAt: new Date('2019-09-13'),
      pages: 352,
      copies: 2,
      available: 2,
      location: 'A-02',
      tags: ['pragmatic', 'career', 'best practices'],
    },
    {
      title: 'Design Patterns',
      author: 'Gang of Four',
      isbn: '9780201633610',
      description: 'Elements of Reusable Object-Oriented Software',
      genre: ['Programming', 'Software Architecture'],
      publisher: 'Addison-Wesley',
      publishedAt: new Date('1994-10-21'),
      pages: 395,
      copies: 2,
      available: 2,
      location: 'A-03',
      tags: ['design patterns', 'OOP', 'architecture'],
    },
    {
      title: 'Dune',
      author: 'Frank Herbert',
      isbn: '9780441013593',
      description: 'A science fiction masterpiece set in the distant future',
      genre: ['Science Fiction', 'Fantasy'],
      publisher: 'Ace Books',
      publishedAt: new Date('1965-08-01'),
      pages: 688,
      copies: 4,
      available: 4,
      location: 'B-01',
      tags: ['sci-fi', 'epic', 'classic'],
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '9780743273565',
      description: 'A story of the fabulously wealthy Jay Gatsby',
      genre: ['Fiction', 'Classic Literature'],
      publisher: 'Scribner',
      publishedAt: new Date('1925-04-10'),
      pages: 180,
      copies: 3,
      available: 3,
      location: 'C-01',
      tags: ['classic', 'american literature', 'jazz age'],
    },
  ];

  for (const bookData of books) {
    await prisma.book.upsert({
      where: { isbn: bookData.isbn },
      update: {},
      create: bookData,
    });
  }

  console.log('Seed completed!');
  console.log(`Created users: ${admin.email}, ${librarian.email}, ${member.email}`);
  console.log(`Created ${books.length} books`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
