package by.intexsoft.projectmanager.domain;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

@Entity
@Table (name="users")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY )
	@Column(name = "user_id")
	@PrimaryKeyJoinColumn
	public Long id;
	
	@Column(nullable=false)
	public String email;
	
	@Column(nullable=false)
	public String password;
	
	@Column(nullable=false)
	public String name;
	
	@Column(nullable=false)
	public String lastName;
	
	@Column(nullable=false)
	public String type="user";
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "user_project", 
			joinColumns = { 
				@JoinColumn(name = "user_id", nullable = false) }, 
				inverseJoinColumns = { @JoinColumn(name = "project_id", nullable = false) })
	@Cascade({CascadeType.SAVE_UPDATE})
	public List<Project> projects;
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "user_iteration", 
			joinColumns = { 
				@JoinColumn(name = "user_id", nullable = false) }, 
				inverseJoinColumns = { @JoinColumn(name = "iteration_id", nullable = false) })
	@Cascade({CascadeType.SAVE_UPDATE})
	public List<Iteration> iterations;
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "user_task", 
			joinColumns = { 
				@JoinColumn(name = "user_id", nullable = false) }, 
				inverseJoinColumns = { @JoinColumn(name = "task_id", nullable = false) })
	@Cascade({CascadeType.SAVE_UPDATE})
	public List<Task> tasks;
	
	@OneToOne(fetch = FetchType.LAZY)
	@Cascade({CascadeType.SAVE_UPDATE})
    @JoinColumn(name="perm_settings_id")
	public PermissionsSettings permissionsSettings;

}
