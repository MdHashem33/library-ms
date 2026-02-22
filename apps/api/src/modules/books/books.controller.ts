import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Books')
@ApiBearerAuth()
@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all books with pagination and filters' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'genre', required: false })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('genre') genre?: string,
  ) {
    return this.booksService.findAll({ page, limit, search, genre });
  }

  @Get('search')
  @ApiOperation({ summary: 'Search books by query' })
  @ApiQuery({ name: 'q', required: true })
  search(@Query('q') q: string) {
    return this.booksService.search(q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book by ID' })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.LIBRARIAN)
  @ApiOperation({ summary: 'Create a new book (ADMIN/LIBRARIAN)' })
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.LIBRARIAN)
  @ApiOperation({ summary: 'Update a book (ADMIN/LIBRARIAN)' })
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.LIBRARIAN)
  @ApiOperation({ summary: 'Delete a book (ADMIN/LIBRARIAN)' })
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
