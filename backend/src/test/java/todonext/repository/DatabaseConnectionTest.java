package todonext.repository;

import todonext.TodoNextApplication;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootTest(classes = TodoNextApplication.class)
public class DatabaseConnectionTest {
    @Autowired
    private DataSource dataSource;

    @Test
    void testDatabaseConnection() {
        assertDoesNotThrow(() -> {
            Connection connection = dataSource.getConnection();
            System.out.println("数据库连接成功！");
            connection.close();
        });
    }
} 